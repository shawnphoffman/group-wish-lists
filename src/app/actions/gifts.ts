'use server'

import { cookies } from 'next/headers'

import { getSessionUser, getUser } from '@/app/actions/auth'
import { ListItem } from '@/components/types'
import { createClient } from '@/utils/supabase/server'

import { getUsers } from './users'

export const createGift = async (itemId: ListItem['id'], quantity: number) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const data = await getSessionUser()
	const giftPromise = await supabase.from('gifted_items').insert([{ item_id: itemId, gifter_id: data?.id, quantity }])
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
	const giftPromise = await supabase.from('gifted_items').delete().eq('item_id', itemId) //.eq('gifter_id', data?.id)
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
		.select('*,gifted_items!inner(giftedAt:created_at,gifter_id),lists!list_items_list_id_fkey(recipient_user_id)')
		.eq('archived', true)
		.not('lists', 'is', null)
		.eq('lists.recipient_user_id', userId)

	const { data: users } = (await getUsers()) || []

	const gifts = resp.data?.map(d => ({
		...d,
		// gifters: users.find(u => u.user_id === d.gifter_id),
		gifters: d.gifted_items.map(gi => ({
			user_id: gi.gifter_id,
			display_name: users.find(u => u.user_id === gi.gifter_id)?.display_name,
		})),
	}))
	// console.log('getMyGifts.resp', gifts)

	return gifts as any
}

export const updateItemAdditionalGifters = async (itemId: ListItem['id'], additionalGifterIds: string[]) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const itemPromise = await supabase
		.from('gifted_items')
		.update([{ additional_gifter_ids: additionalGifterIds }])
		.eq('item_id', itemId)
		.maybeSingle()

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

export const getGifts = async (itemId: ListItem['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('gifted_items')
		.select('gift_id,item_id,quantity,gifter_id,additional_gifter_ids')
		.eq('item_id', itemId)

	if (error) {
		console.error('getGifts.error', error)
		return []
	}

	const { data: users } = (await getUsers()) || []

	const gifts = data?.map(d => ({
		...d,
		user: users.find(u => u.user_id === d.gifter_id),
	}))
	// console.log('getGifts.data', gifts)

	return gifts
}

export const updateGiftQuantity = async (itemId: ListItem['id'], quantity: number) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const data = await getSessionUser()

	const giftPromise = await supabase
		.from('gifted_items')
		.update([{ quantity }])
		.eq('item_id', itemId)
		.eq('gifter_id', data?.id)
		.maybeSingle()

	await Promise.all([
		giftPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	return {
		status: 'success',
	}
}
