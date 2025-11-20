'use server'

import { cookies } from 'next/headers'

import { ListItem } from '@/components/types'
import { createClient } from '@/utils/supabase/server'

export type DbScrape = {
	url?: string
	list_item_id?: ListItem['id']
	title?: string
	title_clean?: string
	description?: string
	price?: string
	price_currency?: string
	scraper_id?: string
	image_urls?: string[]
	scrape_result?: any // json
}

export const saveScrape = async (scrapeData: DbScrape) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const scrapePromise = supabase.from('scrapes').insert([scrapeData]).select('*').single()

	const [scrape] = await Promise.all([scrapePromise])

	console.log('saveScrape', { scrape })

	return {
		status: 'success',
		scrape,
	}
}

// TODO - Update with clean title

export const updateScrapes = async (ids: number[], list_item_id: ListItem['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const scrapePromise = supabase.from('scrapes').update({ list_item_id }).in('id', ids)

	const [scrapes] = await Promise.all([scrapePromise])

	console.log('updateScrapes', { scrapes })

	return {
		status: 'success',
		scrapes,
	}
}
