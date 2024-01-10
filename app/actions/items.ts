'use server'

import { cookies } from 'next/headers'

import { Scrape } from '@/components/lists/create/ScrapePreview'

import { ItemPriority } from '@/utils/enums'
import { createClient } from '@/utils/supabase/server'

export const createItem = async (prevState: any, formData: FormData) => {
	const listId = formData.get('list-id') as string
	const title = formData.get('title') as string
	const url = formData.get('url') as string
	const notes = formData.get('notes') as string
	const priority = formData.get('priority') || (ItemPriority.Normal as string)
	const scrape = formData.get('scrape') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const item = await supabase.from('listItems').insert([{ list_id: listId, title, url, notes, priority, scrape: JSON.parse(scrape) }])
	console.log({ item })

	return {
		status: 'success',
	}
}

// export const createList = async (prevState: any, formData: FormData) => {
// 	const type = formData.get('list-type') as string
// 	const cookieStore = cookies()
// 	const supabase = createClient(cookieStore)
// 	await supabase.from('lists').insert([{ name, active: true, type }])
// 	return {
// 		status: 'success',
// 	}
// }
