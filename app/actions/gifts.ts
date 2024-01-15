'use server'

import { cookies } from 'next/headers'

import { ListItem } from '@/components/lists/types'

import { createClient } from '@/utils/supabase/server'

import { getSessionUser } from './auth'

export const createGift = async (itemId: ListItem['id']) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const data = await getSessionUser()

	const giftPromise = await supabase.from('gifted_items').insert([{ item_id: itemId, gifter_id: data?.id }])

	const [gift] = await Promise.all([
		giftPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	// console.log('gift', gift)

	return {
		status: 'success',
		gift,
	}
}
