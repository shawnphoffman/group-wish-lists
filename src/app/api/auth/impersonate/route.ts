import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
	try {
		// Check if current user is admin
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)
		const { data: currentUser } = await supabase.auth.getUser()

		if (!currentUser.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Check if user is admin
		const { data: userData } = await supabase.from('view_me').select('is_admin').single()

		if (!userData?.is_admin) {
			return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
		}

		// Get target email from request body
		const { email } = await request.json()

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 })
		}

		// Create admin client for impersonation
		const adminClient = createAdminClient()

		// Find user by email
		const { data: users, error: userError } = await adminClient.auth.admin.listUsers()

		if (userError) {
			console.error('Error listing users:', userError)
			return NextResponse.json({ error: 'Failed to find user' }, { status: 500 })
		}

		const targetUser = users.users.find(user => user.email === email.toLowerCase())

		if (!targetUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Generate sign-in link for the target user
		const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
			type: 'magiclink',
			email: targetUser.email!,
			options: {
				redirectTo: `${request.nextUrl.origin}/auth/callback`,
			},
		})

		if (signInError) {
			console.error('Error generating sign-in link:', signInError)
			return NextResponse.json({ error: 'Failed to generate impersonation link' }, { status: 500 })
		}

		return NextResponse.json({
			success: true,
			link: signInData.properties.action_link,
			user: {
				id: targetUser.id,
				email: targetUser.email,
				display_name: targetUser.user_metadata?.display_name || targetUser.email,
			},
		})
	} catch (error) {
		console.error('Impersonation error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
