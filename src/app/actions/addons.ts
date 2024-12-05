'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const createAddon = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const addonUserID = data?.user?.id

	const listId = formData.get('list-id') as string
	const description = formData.get('description') as string

	const addonPromise = supabase.from('list_addons').insert({ list_id: listId, description, user_id: addonUserID })

	console.log('createAddon', { list_id: listId, description, user_id: addonUserID })

	const [resp] = await Promise.all([
		addonPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	const addon = resp.data

	console.log({ addon })

	return {
		status: 'success',
		addon,
	}
}

export const deleteAddon = async (addonId: number) => {
	'use server'
	try {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)

		const itemPromise = supabase.from('list_addons').delete().eq('id', addonId)

		const temp = await Promise.all([
			itemPromise,
			// new Promise(resolve => setTimeout(resolve, 5000)),
		])

		console.log('deleteAddon', { temp, addonId })

		return {
			status: 'success',
		}
	} catch (error) {
		return {
			status: 'error',
		}
	}
}

// export const editComment = async (prevState: any, formData: FormData) => {
// 	'use server'
// 	const cookieStore = await cookies()
// 	const supabase = createClient(cookieStore)

// 	// const id = formData.get('id') as string
// 	// const title = formData.get('title') as string
// 	// const url = formData.get('url') as string
// 	// const notes = formData.get('notes') as string
// 	// const priority = formData.get('priority') || (ItemPriority.Normal as string)
// 	// const scrape = formData.get('scrape') as string
// 	// const imageUrl = formData.get('image-url') as string

// 	// const itemPromise = await supabase
// 	// 	.from('item_comments')
// 	// 	.update([{ title, url, notes, priority, image_url: imageUrl, scrape: JSON.parse(scrape) }])
// 	// 	.eq('id', id)

// 	// const [item] = await Promise.all([
// 	// 	itemPromise,
// 	// 	//
// 	// 	// new Promise(resolve => setTimeout(resolve, 5000)),
// 	// ])

// 	return {
// 		status: 'success',
// 		// item,
// 	}
// }
