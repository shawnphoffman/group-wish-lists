'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

// NOTE
export const getUser = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	return await supabase.auth.getUser()
}

// NOTE
export const signOut = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	await supabase.auth.signOut()
	return redirect('/login')
}

// NOTE
export const signIn = async (formData: FormData) => {
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		return redirect('/login?message=Could not authenticate user')
	}

	return redirect('/')
}

// NOTE
export const signUp = async (formData: FormData) => {
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

// NOTE
export const updateProfile = async (prevState: any, formData: FormData) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const name = formData.get('name') as string
	const { data, error } = await supabase.auth.updateUser({ data: { name } })

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
