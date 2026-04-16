'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export const getUserEmail = async (userId: string) => {
	'use server'
	const supabase = createAdminClient()
	const { data } = await supabase.auth.admin.getUserById(userId)
	return data.user?.email
}

export const getUsersForImpersonation = async () => {
	'use server'
	const supabase = createAdminClient()

	const { data, error } = await supabase.auth.admin.listUsers()
	const { data: users } = await supabase.from('users').select('id,user_id,display_name')

	const allUsers = Object.values(data?.users || {}).reduce((acc: any, user) => {
		const displayName = users?.find(u => u.user_id === user.id)?.display_name
		if (displayName) {
			acc.push({ id: user.id, email: user.email, display_name: users?.find(u => u.user_id === user.id)?.display_name })
		}
		return acc.sort((a, b) => a.display_name.localeCompare(b.display_name))
	}, [] as any)

	return allUsers
}

export const isAdmin = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const { data } = await supabase.from('view_me').select('is_admin').single()

	return data?.is_admin || false
}

export const getUsers = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const resp = await supabase.from('users').select('id,user_id,display_name,image,birth_month,birth_day').order('id', { ascending: true })

	return resp
}

export const getUserById = async (userId: string) => {
	const resp = await getUsers()
	return resp?.data?.find(u => u.user_id === userId)
}

export const getUserPermissions = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const ownerUserID = data?.user?.id

	const resp = await supabase
		.from('user_viewers')
		.select(
			`id, can_view, viewer_user_id, owner_user_id,
			viewer:viewer_user_id(id,display_name,user_id)`
		)
		.eq('owner_user_id', ownerUserID)

	return resp as any
}

export type UpdatePermissionsResult = { status: 'success' } | { status: 'error'; message: string }

// `permId` is ignored: a unique index on (owner_user_id, viewer_user_id) already
// exists at the DB layer, so a single upsert is both race-safe and removes the
// check-then-write branch (where stale client state could trigger a duplicate
// insert and a silent 23505 masquerading as success).
export const updateUserPermissions = async (
	_permId: number | undefined,
	viewerId: string,
	canView: boolean
): Promise<UpdatePermissionsResult> => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const ownerId = data?.user?.id

	if (!ownerId) {
		return { status: 'error', message: 'not_authenticated' }
	}

	const { error } = await supabase
		.from('user_viewers')
		.upsert({ owner_user_id: ownerId, viewer_user_id: viewerId, can_view: canView }, { onConflict: 'owner_user_id,viewer_user_id' })

	if (error) {
		console.error('updateUserPermissions.error', error)
		return { status: 'error', message: error.message }
	}

	revalidatePath('/', 'layout')

	return { status: 'success' }
}
