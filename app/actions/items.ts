'use server'

import { cookies } from 'next/headers'

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

	console.log('item', { item })

	return {
		status: 'success',
		item,
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
	const imageUrl = formData.get('image-url') as string

	const itemPromise = await supabase
		.from('list_items')
		.update([{ title, url, notes, priority, image_url: imageUrl }])
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

export const deleteItem = async (itemId: string) => {
	'use server'
	try {
		const cookieStore = cookies()
		const supabase = createClient(cookieStore)

		const itemPromise = supabase.from('list_items').delete().eq('id', itemId)

		await Promise.all([
			itemPromise,
			// new Promise(resolve => setTimeout(resolve, 5000)),
		])

		return {
			status: 'success',
		}
	} catch (error) {
		return {
			status: 'error',
		}
	}
}
