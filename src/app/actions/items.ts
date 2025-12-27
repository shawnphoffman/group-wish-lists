'use server'

import { cookies } from 'next/headers'

import { List, ListItem } from '@/components/types'
import { ItemPriority } from '@/utils/enums'
import { createClient } from '@/utils/supabase/server'
import { getSessionUser } from './auth'
import { clearListsCache } from './lists'

export const createItem = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const listId = formData.get('list-id') as string
	const title = formData.get('title') as string
	const url = formData.get('url') as string
	const notes = formData.get('notes') as string
	const price = formData.get('price') as string
	const priority = formData.get('priority') || (ItemPriority.Normal as string)
	const scrape = formData.get('scrape') as string
	const imageUrl = formData.get('image-url') as string
	// const tagsRaw = (formData.get('tags') as string)?.split(',')?.map(t => t.trim()) || []
	const quantity = formData.get('quantity') as string

	// const tags = tagsRaw.filter(Boolean)

	const itemPromise = supabase.from('list_items').insert([
		{
			list_id: listId,
			title,
			url,
			notes,
			price,
			priority,
			scrape: JSON.parse(scrape),
			image_url: imageUrl,
			tags: null,
			// tags: tags.length > 0 ? tags : null,
			quantity,
		},
	])

	const [item] = await Promise.all([
		itemPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	// Link image to item if imageUrl is provided
	if (imageUrl && item.data && item.data[0]?.id) {
		// Try to find the image record by signed_url
		const { data: imageRecord } = await supabase.from('images').select('id').eq('signed_url', imageUrl).single()

		if (imageRecord?.id) {
			// Create junction record
			await supabase.from('list_item_images').insert({
				list_item_id: item.data[0].id,
				image_id: imageRecord.id,
			})
		}
	}

	// console.log('item', { item })

	return {
		status: 'success',
		item,
	}
}

export const createMultipleItems = async (listId: List['id'], items: Partial<ListItem>[]) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const itemsToInsert = items.map(item => ({ list_id: listId, ...item }))

	const itemsPromise = supabase.from('list_items').insert(itemsToInsert)

	const [inserted] = await Promise.all([
		itemsPromise,
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	// console.log('createMultipleItems', { inserted })

	return {
		status: 'success',
		inserted,
	}
}

export const editItem = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const id = formData.get('id') as string
	const title = formData.get('title') as string
	const url = formData.get('url') as string
	const notes = formData.get('notes') as string
	const price = formData.get('price') as string
	const priority = formData.get('priority') || (ItemPriority.Normal as string)
	const scrape = formData.get('scrape') as string
	const imageUrl = formData.get('image-url') as string
	// const tagsRaw = (formData.get('tags') as string).split(',').map(t => t.trim())
	const quantity = formData.get('quantity') as string

	// const tags = tagsRaw.filter(Boolean)

	const itemPromise = await supabase
		.from('list_items')
		.update([
			{
				title,
				url,
				notes,
				price,
				priority,
				image_url: imageUrl,
				scrape: JSON.parse(scrape),
				// tags: tags.length > 0 ? tags : null,
				tags: null,
				quantity,
			},
		])
		.eq('id', id)

	const [item] = await Promise.all([
		itemPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	// Update image linkage if imageUrl is provided
	if (imageUrl && id) {
		// Remove existing links
		await supabase.from('list_item_images').delete().eq('list_item_id', id)

		// Try to find the image record by signed_url
		const { data: imageRecord } = await supabase.from('images').select('id').eq('signed_url', imageUrl).single()

		if (imageRecord?.id) {
			// Create new junction record
			await supabase.from('list_item_images').insert({
				list_item_id: id,
				image_id: imageRecord.id,
			})
		}
	} else if (!imageUrl && id) {
		// Remove links if image was removed
		await supabase.from('list_item_images').delete().eq('list_item_id', id)
	}

	return {
		status: 'success',
		item,
	}
}

export const moveItems = async (ids: ListItem['id'][], list_id: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const itemsPromise = await supabase.from('list_items').update([{ list_id }]).in('id', ids)

	const [items] = await Promise.all([
		itemsPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	// Get the current user to invalidate their cache
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	// Invalidate cache for the current user
	await clearListsCache(userId)

	return {
		status: 'success',
		items,
	}
}
export const moveItem = async (id: ListItem['id'], list_id: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const itemPromise = await supabase.from('list_items').update([{ list_id }]).eq('id', id)

	const [item] = await Promise.all([
		itemPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	// Get the current user to invalidate their cache
	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	// Invalidate cache for the current user
	await clearListsCache(userId)

	return {
		status: 'success',
		item,
	}
}

export const deleteItem = async (itemId: string) => {
	'use server'
	try {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)

		const itemPromise = supabase.from('list_items').delete().eq('id', itemId)

		const [item] = await Promise.all([
			itemPromise,
			// new Promise(resolve => setTimeout(resolve, 5000)),
		])

		// console.log('delete item', { item })

		return {
			status: 'success',
			item,
		}
	} catch (error) {
		return {
			status: 'error',
		}
	}
}

export const archiveCompletedItems = async (list_id: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const itemsPromise = await supabase
		.from('list_items')
		.update([{ archived: true }])
		.eq('status', 'complete')
		.eq('list_id', list_id)

	const addonsPromise = await supabase
		.from('list_addons')
		.update([{ archived: true }])
		.eq('list_id', list_id)

	const [items, addons] = await Promise.all([
		itemsPromise,
		addonsPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	// console.log('archiveCompletedItems', { items, addons })

	return {
		status: 'success',
		items,
	}
}

export const updateItemStatus = async (itemId: ListItem['id'], status: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const itemPromise = await supabase.from('list_items').update([{ status }]).eq('id', itemId)

	const [item] = await Promise.all([
		itemPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	return {
		status: 'success',
		item,
	}
}

export const getRecentItems = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	try {
		const currentUser = await getSessionUser()
		const resp = await supabase
			.from('list_items')
			.select(
				`id, list_id, title, created_at, updated_at, image_url, priority, status,
				lists:lists!list_items_list_id_fkey(id, name, recipient_user_id, private, active),
				user:users!list_items_user_id_fkey1(user_id, display_name)`
			)
			.is('archived', false)
			.is('lists.private', false)
			.is('lists.active', true)
			.not('lists', 'is', null)
			// .order('updated_at', { ascending: false })
			.order('created_at', { ascending: false })
			.limit(50)

		const filtered = resp.data?.filter(item => {
			const lists = item.lists as unknown as { recipient_user_id: string } | null
			const isRecipient = lists?.recipient_user_id === currentUser?.id
			// const isComplete = item.status === 'complete'
			// Keep item if NOT (isRecipient AND isComplete)
			// return !(isRecipient && isComplete)
			return !isRecipient
		})

		const result = {
			...resp,
			data: filtered,
		}
		return result as any
	} catch (error) {
		console.error('getRecentItems.resp.error', error)
	}
}
