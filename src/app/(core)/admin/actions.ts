'use server'

import { cookies } from 'next/headers'

// import { redirect } from 'next/navigation'
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

// export const getSessionUser = async () => {
// 	'use server'
// 	const cookieStore = cookies()
// 	const supabase = createClient(cookieStore)
// 	const { data, error } = await supabase.auth.getSession()
// 	if (error || !data?.session?.user) {
// 		return null
// 	}
// 	return data.session.user
// }

// export const getUser = async () => {
// 	'use server'
// 	const cookieStore = cookies()
// 	const supabase = createClient(cookieStore)
// 	return await supabase.from('view_me').select('id,user_id,display_name,is_parent,email').single()
// }

// export const updateProfile = async (prevState: any, formData: FormData) => {
// 	'use server'
// 	const cookieStore = cookies()
// 	const supabase = createClient(cookieStore)
// 	const name = formData.get('name') as string
// 	const userId = formData.get('user_id') as string
// 	const { data, error } = await supabase.from('users').update({ display_name: name }).eq('user_id', userId)
// 	// await new Promise(resolve => setTimeout(resolve, 5000))

// 	if (error) {
// 		return {
// 			error: error.message,
// 		}
// 	}

// 	return {
// 		status: 'success',
// 		data,
// 	}
// }
