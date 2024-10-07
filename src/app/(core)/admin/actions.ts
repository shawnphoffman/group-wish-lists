'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const inviteUser = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const email = formData.get('email') as string
	const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)
	console.log('inviteUser', { data, error })
	if (error || !data?.user) {
		return {
			status: 'error',
			error,
		}
	}

	return {
		status: 'success',
		user: data.user,
	}
}
