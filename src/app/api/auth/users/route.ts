import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
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

		// Create admin client
		const adminClient = createAdminClient()

		// Get all users
		const { data: users, error: userError } = await adminClient.auth.admin.listUsers()

		if (userError) {
			console.error('Error listing users:', userError)
			return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
		}

		// Format user data for the frontend
		const formattedUsers = users.users.map(user => ({
			id: user.id,
			email: user.email,
			display_name: user.user_metadata?.display_name || user.email,
			created_at: user.created_at,
			last_sign_in_at: user.last_sign_in_at,
			email_confirmed_at: user.email_confirmed_at,
		}))

		return NextResponse.json({
			success: true,
			users: formattedUsers,
		})
	} catch (error) {
		console.error('List users error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
