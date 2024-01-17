'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

//
export const getSessionUser = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data, error } = await supabase.auth.getSession()
	if (error || !data?.session?.user) {
		return null
	}
	return data.session.user
}

//
export const getUser = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	return await supabase.from('view_me').select('id,user_id,display_name,is_parent,email').single()
}

//
export const signOut = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	await supabase.auth.signOut()
	return redirect('/login')
}

//
export const signIn = async (formData: FormData) => {
	'use server'
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.signInWithPassword({
		email: email.toLowerCase(),
		password,
	})

	if (error) {
		return redirect('/login?message=Could not authenticate user')
	}

	return redirect('/')
}

//
export const signUp = async (formData: FormData) => {
	'use server'
	const origin = headers().get('origin')
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	})

	if (error) {
		return redirect('/login?message=Could not authenticate user')
	}

	return redirect('/login?message=Check email to continue sign in process')
}

//
export const updateProfile = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const name = formData.get('name') as string
	const userId = formData.get('user_id') as string
	const { data, error } = await supabase.from('users').update({ display_name: name }).eq('user_id', userId)
	// await new Promise(resolve => setTimeout(resolve, 5000))

	if (error) {
		return {
			error: error.message,
		}
	}

	return {
		status: 'success',
		data,
	}
}
