'use server'

import { createSigner, createVerifier } from 'fast-jwt'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

const IMPERSONATION_JWT_KEY = process.env.IMPERSONATION_JWT_KEY!
const impersonationJwtSigner = createSigner({ key: IMPERSONATION_JWT_KEY })
export const impersonationJwtVerifier = createVerifier({ key: IMPERSONATION_JWT_KEY })

export const isImpersonating = async () => {
	'use server'
	const cookieStore = await cookies()
	const cookie = cookieStore.get('admin-impersonation')
	try {
		if (cookie) {
			console.log('cookie', cookie)
			const token = impersonationJwtVerifier(cookie.value)
			console.log('token', token)
			return token.admin_email
		}
		return false
	} catch (error) {
		console.log('error', error)
		return false
	}
}

//
export const impersonateUser = async (email: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Check if current user is admin
	const { data: userData } = await supabase.from('view_me').select('is_admin').single()

	const { data: currentUser } = await supabase.auth.getUser()

	if (!userData?.is_admin) {
		return {
			status: 'error',
			error: 'Admin access required',
		}
	}

	// Create admin client for impersonation
	const adminClient = createAdminClient()

	// Generate sign-in link for the target user
	const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
		type: 'magiclink',
		// email: targetUser.email!,
		email: email,
		// options: {
		// 	redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/auth/confirm`,
		// },
	})

	if (signInError) {
		console.error('Error generating sign-in link:', signInError)
		return {
			status: 'error',
			error: 'Failed to generate impersonation link',
		}
	}

	// again in impersonation start code
	const jwt = impersonationJwtSigner({
		admin_email: currentUser.user!.email,
	})
	console.log('currentUser', { currentUser, jwt })
	cookieStore.set('admin-impersonation', jwt, {
		path: '/',
		httpOnly: false,
	})

	const tokenHash = signInData.properties.hashed_token
	const searchParams = new URLSearchParams({
		token_hash: tokenHash,
	})
	const impersonationLoginLink = `/auth/confirm?${searchParams}`
	return {
		link: impersonationLoginLink,
	}
}

//
export const stopImpersonation = async (email: string) => {
	'use server'
	const cookieStore = await cookies()
	// Create admin client for impersonation
	const adminClient = createAdminClient()

	const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
		type: 'magiclink',
		email: email,
	})

	if (signInError) {
		console.error('Error generating sign-in link:', signInError)
		return {
			status: 'error',
			error: 'Failed to generate impersonation link',
		}
	}

	const tokenHash = signInData.properties.hashed_token
	const searchParams = new URLSearchParams({
		token_hash: tokenHash,
	})
	const impersonationLoginLink = `/auth/confirm?${searchParams}`

	cookieStore.set('admin-impersonation', '', {
		maxAge: 1,
	})

	return {
		link: impersonationLoginLink,
	}
}
