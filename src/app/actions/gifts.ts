'use server'

import { cookies } from 'next/headers'

import { getSessionUser } from '@/app/actions/auth'
import { ListItem } from '@/components/types'
import { createClient } from '@/utils/supabase/server'

export const createGift = async (itemId: ListItem['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const data = await getSessionUser()
	const giftPromise = await supabase.from('gifted_items').insert([{ item_id: itemId, gifter_id: data?.id }])
	// const [gift] = await Promise.all([
	await Promise.all([
		giftPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	// console.log('gift', gift)

	return {
		status: 'success',
		// gift,
	}
}

export const deleteGift = async (itemId: ListItem['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const data = await getSessionUser()
	const giftPromise = await supabase.from('gifted_items').delete().eq('item_id', itemId).eq('gifter_id', data?.id)
	await Promise.all([
		giftPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	return {
		status: 'success',
	}
}

export const getMyGifts = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const userId = data?.user?.id

	const resp = await supabase
		.from('view_sorted_list_items')
		.select('*,gifted_items!inner(giftedAt:created_at),lists!list_items_list_id_fkey(recipient_user_id)')
		.eq('archived', true)
		.not('lists', 'is', null)
		.eq('lists.recipient_user_id', userId)

	// console.log('getMyGifts.resp', resp.data)

	return resp as any
}
