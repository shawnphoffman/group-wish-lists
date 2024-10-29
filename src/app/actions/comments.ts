'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const createComment = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const commentingUserID = data?.user?.id

	const itemId = formData.get('item-id') as string
	const comment = formData.get('comment') as string

	const commentPromise = supabase.from('item_comments').insert({ item_id: itemId, comments: comment, user_id: commentingUserID })

	// console.log('createComment', { item_id: itemId, comments: comment, user_id: commentingUserID })
	const [resp] = await Promise.all([
		commentPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	const comm = resp.data

	console.log({ comm })

	return {
		status: 'success',
		comm,
	}
}

export const editComment = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// const id = formData.get('id') as string
	// const title = formData.get('title') as string
	// const url = formData.get('url') as string
	// const notes = formData.get('notes') as string
	// const priority = formData.get('priority') || (ItemPriority.Normal as string)
	// const scrape = formData.get('scrape') as string
	// const imageUrl = formData.get('image-url') as string

	// const itemPromise = await supabase
	// 	.from('item_comments')
	// 	.update([{ title, url, notes, priority, image_url: imageUrl, scrape: JSON.parse(scrape) }])
	// 	.eq('id', id)

	// const [item] = await Promise.all([
	// 	itemPromise,
	// 	//
	// 	// new Promise(resolve => setTimeout(resolve, 5000)),
	// ])

	return {
		status: 'success',
		// item,
	}
}

export const deleteComment = async (commentId: number) => {
	'use server'
	try {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)

		const itemPromise = supabase.from('item_comments').delete().eq('id', commentId)

		const temp = await Promise.all([
			itemPromise,
			// new Promise(resolve => setTimeout(resolve, 5000)),
		])

		console.log('deleteComment', { temp, commentId })

		return {
			status: 'success',
		}
	} catch (error) {
		return {
			status: 'error',
		}
	}
}
