'use server'

import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

// Simple in-memory cache for users
const usersCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = process.env.USERS_CACHE_TTL ? parseInt(process.env.USERS_CACHE_TTL) : 60 * 60 * 1000 // 1 hour in milliseconds

const getCacheKey = (userId?: string) => {
	return `users_${userId || 'anonymous'}`
}

const isCacheValid = (timestamp: number) => {
	return Date.now() - timestamp < CACHE_TTL
}

const invalidateUsersCache = (userId?: string) => {
	if (userId) {
		// Invalidate all cache entries for this user
		for (const [key] of usersCache.entries()) {
			if (key.includes(userId)) {
				usersCache.delete(key)
			}
		}
	} else {
		// Invalidate all cache entries
		usersCache.clear()
	}
}

// Export function to manually clear cache (useful for debugging)
export const clearUsersCache = async (userId?: string) => {
	invalidateUsersCache(userId)
}

// Export function to get cache statistics (useful for debugging)
export const getUsersCacheStats = async () => {
	return {
		size: usersCache.size,
		keys: Array.from(usersCache.keys()),
		ttl: CACHE_TTL,
	}
}

export const getUsersForImpersonation = async () => {
	'use server'
	// const cookieStore = await cookies()
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

	// console.log('getUsersForImpersonation.resp', data, error)

	return allUsers
	// return data?.users.map(user => ({ id: user.id, email: user.email })) || []
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

	// Get current user for cache key
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id
	const cacheKey = getCacheKey(userId)

	// Check cache first
	const cached = usersCache.get(cacheKey)
	if (cached && isCacheValid(cached.timestamp)) {
		console.log('Cache HIT for users')
		return cached.data
	}
	console.log('Cache MISS for users')

	const resp = await supabase.from('users').select('id,user_id,display_name,image').order('id', { ascending: true })

	// Cache the result
	usersCache.set(cacheKey, { data: resp, timestamp: Date.now() })

	// console.log('getUsers.resp', resp)

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

	// console.log('getUserPermissions', resp)

	return resp as any
}

export const updateUserPermissions = async (permId: number | undefined, viewerId: string, canView: boolean) => {
	'use server'
	const cookieStore = await cookies()
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
