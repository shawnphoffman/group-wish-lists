'use server'

import { cookies } from 'next/headers'

import { List, ListItem } from '@/components/types'
import { ItemPriority } from '@/utils/enums'
import { createClient } from '@/utils/supabase/server'

export const createItem = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const listId = formData.get('list-id') as string
	const title = formData.get('title') as string
	const url = formData.get('url') as string
	const notes = formData.get('notes') as string
	const priority = formData.get('priority') || (ItemPriority.Normal as string)
	const scrape = formData.get('scrape') as string
	const imageUrl = formData.get('image-url') as string

	const itemPromise = supabase
		.from('list_items')
		.insert([{ list_id: listId, title, url, notes, priority, scrape: JSON.parse(scrape), image_url: imageUrl }])

	const [item] = await Promise.all([
		itemPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	// console.log('item', { item })

	return {
		status: 'success',
		item,
	}
}

export const createMultipleItems = async (listId: List['id'], items: Partial<ListItem>[]) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const itemsToInsert = items.map(item => ({ list_id: listId, ...item }))

	const itemsPromise = supabase.from('list_items').insert(itemsToInsert)

	const [inserted] = await Promise.all([
		itemsPromise,
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	console.log('createMultipleItems', { inserted })

	return {
		status: 'success',
		inserted,
	}
}

export const editItem = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const id = formData.get('id') as string
	const title = formData.get('title') as string
	const url = formData.get('url') as string
	const notes = formData.get('notes') as string
	const priority = formData.get('priority') || (ItemPriority.Normal as string)
	const scrape = formData.get('scrape') as string
	const imageUrl = formData.get('image-url') as string

	const itemPromise = await supabase
		.from('list_items')
		.update([{ title, url, notes, priority, image_url: imageUrl, scrape: JSON.parse(scrape) }])
		.eq('id', id)

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

export const moveItem = async (id: ListItem['id'], list_id: List['id']) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const itemPromise = await supabase.from('list_items').update([{ list_id }]).eq('id', id)

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

export const deleteItem = async (itemId: string) => {
	'use server'
	try {
		const cookieStore = cookies()
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
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const itemsPromise = await supabase
		.from('list_items')
		.update([{ archived: true }])
		.eq('status', 'complete')
		.eq('list_id', list_id)

	const [items] = await Promise.all([
		itemsPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	console.log('archiveCompletedItems', { items })

	return {
		status: 'success',
		items,
	}
}
