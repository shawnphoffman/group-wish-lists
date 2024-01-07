'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export const getUser = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	return await supabase.auth.getUser()
}

export const signOut = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	await supabase.auth.signOut()
	return redirect('/login')
}

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
