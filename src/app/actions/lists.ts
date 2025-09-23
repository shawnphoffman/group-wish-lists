'use server'

import { cookies } from 'next/headers'

import { ListType } from '@/components/me/MyLists'
import { List, ListItem, User } from '@/components/types'
import { ListCategory } from '@/utils/enums'
import { createClient } from '@/utils/supabase/server'

// Simple in-memory cache for lists
const listsCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = process.env.LISTS_CACHE_TTL ? parseInt(process.env.LISTS_CACHE_TTL) : 5 * 60 * 1000 // 5 minutes in milliseconds

const getCacheKey = (type: string, userId?: string) => {
	return `lists_${type}_${userId || 'anonymous'}`
}

const isCacheValid = (timestamp: number) => {
	return Date.now() - timestamp < CACHE_TTL
}

const invalidateListsCache = (userId?: string) => {
	if (userId) {
		// Invalidate all cache entries for this user
		for (const [key] of listsCache.entries()) {
			if (key.includes(userId)) {
				listsCache.delete(key)
			}
		}
	} else {
		// Invalidate all cache entries
		listsCache.clear()
	}
}

// Export function to manually clear cache (useful for debugging)
export const clearListsCache = async (userId?: string) => {
	invalidateListsCache(userId)
}

// Export function to get cache statistics (useful for debugging)
export const getListsCacheStats = async () => {
	return {
		size: listsCache.size,
		keys: Array.from(listsCache.keys()),
		ttl: CACHE_TTL,
	}
}

const monthToNumber: { [key: string]: number } = {
	january: 1,
	february: 2,
	march: 3,
	april: 4,
	may: 5,
	june: 6,
	july: 7,
	august: 8,
	september: 9,
	october: 10,
	november: 11,
	december: 12,
}

const sortUserGroupsByBirthDate = (a: Partial<User>, b: Partial<User>) => {
	const currentDate = new Date()
	// const currentDate = new Date('July 17, 2024 03:24:00')
	const currentMonth = currentDate.getMonth() + 1
	const currentDay = currentDate.getDate()
	let aMonth = monthToNumber[a.birth_month!]
	if (aMonth < currentMonth) {
		aMonth += 12
	} else if (aMonth === currentMonth && a.birth_day! < currentDay) {
		aMonth += 12
	}

	let bMonth = monthToNumber[b.birth_month!]
	if (bMonth < currentMonth) {
		bMonth += 12
	} else if (bMonth === currentMonth && b.birth_day! < currentDay) {
		bMonth += 12
	}

	if (aMonth <= currentMonth && a.birth_day === currentDay) {
		return -1
	}
	if (bMonth <= currentMonth && b.birth_day === currentDay) {
		return 1
	}

	// console.log({
	// 	aMonth,
	// 	bMonth,
	// 	currentMonth,
	// 	currentDay,
	// 	bDay: b.birth_day,
	// 	aDay: a.birth_day,
	// 	a_month: a.birth_month,
	// 	b_month: b.birth_month,
	// })

	if (aMonth === bMonth) {
		return a.birth_day! - b.birth_day!
	}
	return aMonth! - bMonth!
}

export const getListsGroupedByUser = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase
		.from('view_users')
		.select('id,user_id,email,display_name,birth_month,birth_day,image,lists:view_sorted_lists(*)')
		.not('lists', 'is', null)
		.order('id', { ascending: true })

	try {
		if (resp.data) {
			resp.data.sort(sortUserGroupsByBirthDate)
		}
	} catch (error) {
		console.error('getListsGroupedByUser.resp.error', error)
	}

	// console.log('getListsGroupedByUser.resp', resp)

	return resp as any
}

export const getMyLists = async (type = 'all') => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Get current user for cache key
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id
	const cacheKey = getCacheKey(type, userId)

	// Check cache first
	const cached = listsCache.get(cacheKey)
	if (cached && isCacheValid(cached.timestamp)) {
		console.log(`Cache HIT for ${type} lists`)
		return cached.data
	}
	console.log(`Cache MISS for ${type} lists`)

	let resp

	// await new Promise(resolve => setTimeout(resolve, 5000))
	if (type === ListType.PUBLIC) {
		resp = await supabase.from('view_my_lists').select('*').is('private', false)
	} else if (type === ListType.PRIVATE) {
		resp = await supabase.from('view_my_lists').select('*').is('private', true).not('type', 'eq', ListCategory.GiftIdeas)
	} else if (type === ListType.GIFT_IDEAS) {
		resp = await supabase.from('view_list_gift_ideas').select('*')
	} else if (type === ListType.SHARED_WITH_ME) {
		resp = await supabase.from('view_shared_with_me').select('*').not('type', 'eq', ListCategory.GiftIdeas)
	} else if (type === ListType.SHARED_WITH_OTHERS) {
		resp = await supabase.from('view_shared_with_others').select(`
			*,
			editors:list_editors(user:user_id(display_name, user_id))
			`)
	} else {
		resp = await supabase.from('view_my_lists').select('*')
	}

	// Cache the result
	listsCache.set(cacheKey, { data: resp, timestamp: Date.now() })

	// console.log('getMyLists.resp', resp)

	return resp
}

export const getMyPurchases = async () => {
	'use server'

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('view_my_purchases').select()

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const purchases = resp.data?.reduce((acc, p) => {
		if (p.gifter_id === viewingUserID && p.user_id !== viewingUserID) {
			acc.push(p)
		}
		return acc
	}, [])

	// console.log('getMyLists.resp', resp)

	return purchases as any
}

export const getEditableList = async (listID: number) => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const resp = await supabase
		.from('view_my_lists2')
		.select(
			`name, type, active, user_id, description, private,
			recipient:recipient_user_id(id, display_name, user_id),
			listItems:view_sorted_list_items!list_items_list_id_fkey(
				*,
				item_comments!item_comments_item_id_fkey(
					id,
					item_id,
					comments,
					created_at,
					edited_at,
					archived,
					user:user_id(user_id, display_name)
				)
			),
			editors:list_editors(user:user_id(display_name, user_id))`
		)
		.eq('id', listID)
		// .returns<EditableList[]>()
		// .not('active', 'is', false)
		.single()
		.then(async list => {
			const updatedItems = list.data?.listItems?.map((item: any) => {
				return {
					...item,
					item_comments: item?.item_comments
						?.map((comment: any) => {
							// console.log('getViewableList.comment', comment)
							if (comment.archived && comment.user.user_id !== viewingUserID) {
								return null
							}
							return {
								...comment,
								isOwner: comment.user.user_id === viewingUserID,
							}
						})
						.filter((comment: any) => comment),
				}
			})

			if (list?.data?.listItems && updatedItems) {
				list.data.listItems = updatedItems
			}

			return {
				...(list as any),

				isOwner: list.data?.user_id === viewingUserID,
				viewingUserID,
			}
		})

	// console.log('getEditableList.resp', JSON.stringify(resp, null, 2))
	// console.log('getEditableList.resp', resp)

	return resp as any
}

export const getViewableList = async (listID: number) => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const resp = await supabase
		.from('lists')
		.select(
			`name,type,user_id,description,
			recipient:recipient_user_id(id,display_name,user_id,image),
			listItems:view_sorted_list_items!list_items_list_id_fkey(
				*,
				item_comments!item_comments_item_id_fkey(
					id,
					item_id,
					comments,
					created_at,
					edited_at,
					archived,
					user:user_id(user_id, display_name)
				)
			)`
		)
		.eq('id', listID)
		.eq('private', false)
		.not('active', 'is', false)
		.maybeSingle()
		.then(async list => {
			const updatedItems = list.data?.listItems?.map((item: any) => {
				return {
					...item,
					item_comments: item?.item_comments
						?.map((comment: any) => {
							// console.log('getViewableList.comment', comment)
							if (comment.archived && comment.user.user_id !== viewingUserID) {
								return null
							}

							return {
								...comment,
								isOwner: comment.user.user_id === viewingUserID,
							}
						})
						.filter((comment: any) => comment),
				}
			})

			if (list?.data?.listItems && updatedItems) {
				list.data.listItems = updatedItems
			}

			return {
				...list,

				isOwner: list.data?.user_id === viewingUserID,
				viewingUserID,
			}
		})

	// console.log('getViewableList.resp', resp)

	return resp
}

export const getListAddons = async (listID: number) => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const resp = await supabase
		.from('list_addons')
		.select(`id,created_at,description,user:user_id(user_id, display_name)`)
		.eq('list_id', listID)
		.is('archived', false)
		.order('created_at', { ascending: false })
		.then(async addons => {
			const updatedAddons = addons.data?.map((addon: any) => {
				return {
					...addon,
					is_gifter: addon.user.user_id === viewingUserID,
				}
			})

			if (addons?.data && updatedAddons) {
				addons.data = updatedAddons
			}

			return addons
		})

	// console.log('getListAddons.resp', resp)

	return resp as any
}

export const createList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const type = formData.get('list-type') as string
	let owner = formData.get('list-owner') as string
	const isPrivate = type === ListCategory.GiftIdeas ? true : (formData.get('list-privacy') as string) === 'private'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// console.log('createList', { name, type, isPrivate, formData, owner })

	if (!name?.trim()) {
		return {
			status: 'error',
			message: 'List name is required',
		}
	}
	if (!owner) {
		const { data } = await supabase.auth.getUser()
		owner = data?.user?.id!
	}

	const createPromise = supabase.from('lists').insert({ recipient_user_id: owner, name, active: true, type, private: isPrivate })

	const [list] = await Promise.all([
		createPromise,
		// new Promise(resolve => setTimeout(resolve, 5000))
	])

	// Invalidate cache for the owner
	invalidateListsCache(owner)

	// console.log('createList', list)

	return {
		status: 'success',
		list,
	}
}

export const renameList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const type = formData.get('list-type') as string
	const isPrivate = (formData.get('list-privacy') as string) === 'private'
	const description = formData.get('list-description') as string
	const id = formData.get('id') as string
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Get the current user to invalidate their cache
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	await supabase.from('lists').update({ name, type, private: isPrivate, description }).eq('id', id)

	// Invalidate cache for the current user
	invalidateListsCache(userId)

	// console.log('renameList', { name, type, isPrivate, description, id, temp })

	return {
		status: 'success',
	}
}

export const archiveList = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Get the current user to invalidate their cache
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	await supabase.from('lists').update({ active: false }).eq('id', listID)

	// Invalidate cache for the current user
	invalidateListsCache(userId)

	return {
		status: 'success',
	}
}

export const unarchiveList = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Get the current user to invalidate their cache
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	await supabase.from('lists').update({ active: true }).eq('id', listID)

	// Invalidate cache for the current user
	invalidateListsCache(userId)

	return {
		status: 'success',
	}
}

export const deleteList = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Get the current user to invalidate their cache
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	const list = await supabase.from('lists').delete().eq('id', listID)

	// Invalidate cache for the current user
	invalidateListsCache(userId)

	// console.log('deleteList', list)

	return {
		status: 'success',
	}
}

export const getUserEditors = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const editorUserId = data?.user?.id!

	const resp = await supabase.from('user_editors').select('editor:owner_user_id(user_id, display_name)').eq('editor_user_id', editorUserId)

	let newListsFor: { user_id: string; display_name: string }[] = []

	if (resp.data) {
		// @ts-expect-error TODO: fix this
		newListsFor = [...newListsFor, ...resp.data.map(result => result.editor)]
	}

	// console.log('getUserEditors', resp.data, newListsFor)

	return newListsFor
}

export const getListEditors = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('list_editors').select('id, user_id, list_id').eq('list_id', listID)

	if (resp.data) {
		return resp.data.map((editor: { user_id: string }) => editor.user_id)
	}

	return []
}

export const createEditor = async (listId: List['id'], editorId: User['user_id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const editorPromise = supabase.from('list_editors').insert([{ list_id: listId, user_id: editorId }])

	const editor = await Promise.all([
		editorPromise,
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	// Invalidate cache for both the editor and the list owner
	invalidateListsCache(editorId)
	// Note: We'd need to get the list owner ID to invalidate their cache too
	// For now, we'll invalidate all cache entries

	// console.log('createEditor', editor)

	return {
		status: 'success',
	}
}

export const deleteEditor = async (listId: List['id'], editorId: User['user_id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const editorPromise = supabase.from('list_editors').delete().eq('list_id', Number(listId)).eq('user_id', editorId)

	const editor = await Promise.all([
		editorPromise,
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	// Invalidate cache for the editor
	invalidateListsCache(editorId)

	// console.log('deleteEditor', { editor, listId, editorId })

	return {
		status: 'success',
	}
}

export const setPrimaryList = async (listId: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	await supabase.from('lists').update({ primary: false }).eq('user_id', userId).eq('private', false).eq('active', true)

	await supabase.from('lists').update({ primary: true }).eq('id', listId)

	// Invalidate cache for the current user
	invalidateListsCache(userId)

	return {
		status: 'success',
	}
}

export const unsetPrimaryList = async (listId: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	await supabase.from('lists').update({ primary: false }).eq('id', listId)

	// Invalidate cache for the current user
	invalidateListsCache(userId)

	return {
		status: 'success',
	}
}

export const getListById = async (id: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.from('lists').select().eq('id', id).single()

	console.log('getListById', data)

	return data
}
