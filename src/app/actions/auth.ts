'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

//
export const getSessionUser = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const { data, error } = await supabase.auth.getUser()
	if (error || !data?.user) {
		return null
	}
	return data.user
}

//
export const getUser = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	return await supabase.from('view_me').select('id,user_id,display_name,birth_month,birth_day,image').single()
}

//
export const signOut = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	await supabase.auth.signOut()
	return redirect('/auth/login')
}

//
export const signIn = async (formData: FormData) => {
	'use server'
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const returnUrl = formData.get('returnUrl') as string
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.signInWithPassword({
		email: email.toLowerCase().trim(),
		password,
	})

	if (error) {
		console.error('signIn.error', error)

		const url = new URL('/auth/login', 'http://example.com')
		url.searchParams.append('message', error.message || 'Something went wrong...')

		if (returnUrl) url.searchParams.append('returnUrl', returnUrl)

		if (error.code) url.searchParams.append('code', error.code)

		console.log('url', url)

		return redirect(`${url.pathname}${url.search}`)
	}

	return returnUrl ? redirect(returnUrl) : redirect('/')
}

//
export const signUp = async (formData: FormData) => {
	'use server'
	const origin = (await headers()).get('origin')
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	})

	if (error) {
		return redirect('/auth/login?message=Could not authenticate user')
	}

	return redirect('/auth/login?message=Check email to continue sign in process')
}

//
export const updateProfile = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const name = formData.get('name') as string
	const birth_month = formData.get('birth_month') as string
	const birth_day = formData.get('birth_day') as string
	const userId = formData.get('user_id') as string
	const { data, error } = await supabase
		//
		.from('users')
		.update({ display_name: name, birth_month, birth_day })
		.eq('user_id', userId)

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
//
export const updatePassword = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// console.log('updatePassword', { formData })

	const newPassword = formData.get('new-password') as string
	const confirmPassword = formData.get('confirm-password') as string

	if (newPassword !== confirmPassword) {
		return {
			error: 'Passwords do not match',
			status: 'error',
		}
	}

	const { data, error } = await supabase.auth.updateUser({ password: newPassword })

	// console.log('password response', {
	// 	newPassword,
	// 	confirmPassword,
	// 	data,
	// 	error,
	// })

	if (error) {
		return {
			error: error.message,
			status: 'error',
		}
	}

	return {
		status: 'success',
		data,
	}
}

//
export const updateEmail = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// console.log('email', { formData })

	const email = formData.get('email') as string

	const { error } = await supabase.auth.updateUser({ email })

	// console.log('email response', data)

	// await new Promise(resolve => setTimeout(resolve, 5000))

	if (error) {
		return {
			error: error.message,
			status: 'error',
		}
	}

	return {
		status: 'success',
	}
}

//
export const impersonateUser = async (email: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Check if current user is admin
	const { data: userData } = await supabase.from('view_me').select('is_admin').single()

	if (!userData?.is_admin) {
		return {
			status: 'error',
			error: 'Admin access required',
		}
	}

	// Create admin client for impersonation
	const adminClient = createAdminClient()

	// Find user by email
	const { data: users, error: userError } = await adminClient.auth.admin.listUsers()

	if (userError) {
		console.error('Error listing users:', userError)
		return {
			status: 'error',
			error: 'Failed to find user',
		}
	}

	const targetUser = users.users.find(user => user.email === email.toLowerCase())

	if (!targetUser) {
		return {
			status: 'error',
			error: 'User not found',
		}
	}

	// Generate sign-in link for the target user
	const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
		type: 'magiclink',
		email: targetUser.email!,
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/auth/callback`,
		},
	})

	if (signInError) {
		console.error('Error generating sign-in link:', signInError)
		return {
			status: 'error',
			error: 'Failed to generate impersonation link',
		}
	}

	return {
		status: 'success',
		link: signInData.properties.action_link,
		user: {
			id: targetUser.id,
			email: targetUser.email,
			display_name: targetUser.user_metadata?.display_name || targetUser.email,
		},
	}
}

//
export const stopImpersonation = async (adminUserId: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Check if current user is admin
	const { data: userData } = await supabase.from('view_me').select('is_admin').single()

	if (!userData?.is_admin) {
		return {
			status: 'error',
			error: 'Admin access required',
		}
	}

	// Create admin client
	const adminClient = createAdminClient()

	// Get the admin user details
	const { data: adminUser, error: adminError } = await adminClient.auth.admin.getUserById(adminUserId)

	if (adminError || !adminUser.user) {
		console.error('Error getting admin user:', adminError)
		return {
			status: 'error',
			error: 'Admin user not found',
		}
	}

	// Generate sign-in link for the admin user
	const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
		type: 'magiclink',
		email: adminUser.user.email!,
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/auth/callback`,
		},
	})

	if (signInError) {
		console.error('Error generating admin sign-in link:', signInError)
		return {
			status: 'error',
			error: 'Failed to generate admin sign-in link',
		}
	}

	return {
		status: 'success',
		link: signInData.properties.action_link,
		user: {
			id: adminUser.user.id,
			email: adminUser.user.email,
			display_name: adminUser.user.user_metadata?.display_name || adminUser.user.email,
		},
	}
}
