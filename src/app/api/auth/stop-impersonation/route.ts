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

		// Get the original admin user ID from request body
		const { adminUserId } = await request.json()

		if (!adminUserId) {
			return NextResponse.json({ error: 'Admin user ID is required' }, { status: 400 })
		}

		// Create admin client
		const adminClient = createAdminClient()

		// Get the admin user details
		const { data: adminUser, error: adminError } = await adminClient.auth.admin.getUserById(adminUserId)

		if (adminError || !adminUser.user) {
			console.error('Error getting admin user:', adminError)
			return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
		}

		// Generate sign-in link for the admin user
		const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
			type: 'magiclink',
			email: adminUser.user.email!,
			options: {
				redirectTo: `${request.nextUrl.origin}/auth/callback`,
			},
		})

		if (signInError) {
			console.error('Error generating admin sign-in link:', signInError)
			return NextResponse.json({ error: 'Failed to generate admin sign-in link' }, { status: 500 })
		}

		return NextResponse.json({
			success: true,
			link: signInData.properties.action_link,
			user: {
				id: adminUser.user.id,
				email: adminUser.user.email,
				display_name: adminUser.user.user_metadata?.display_name || adminUser.user.email,
			},
		})
	} catch (error) {
		console.error('Stop impersonation error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
