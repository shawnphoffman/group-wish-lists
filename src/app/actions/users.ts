'use server'

import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const getUsers = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('users').select('id,user_id,display_name').order('id', { ascending: true })

	// console.log('getUsers.resp', resp)

	return resp
}

export const getUserPermissions = async () => {
	'use server'
	const cookieStore = cookies()
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

	// console.log('getUserPermissions', resp)

	return resp
}

export const updateUserPermissions = async (permId: number | undefined, viewerId: string, canView: boolean) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const ownerId = data?.user?.id

	// console.log('updateUserPermissions', { viewerId, canView, ownerId, permId })

	let permPromise: PostgrestSingleResponse<null>

	if (permId) {
		permPromise = await supabase
			.from('user_viewers')
			.update({ can_view: canView })
			.eq('owner_user_id', ownerId)
			.eq('viewer_user_id', viewerId)
	} else {
		permPromise = await supabase.from('user_viewers').insert({ owner_user_id: ownerId, viewer_user_id: viewerId, can_view: canView })
	}

	const [perm] = await Promise.all([
		permPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	// console.log('perm', perm)

	return {
		status: 'success',
		perm,
	}
}
