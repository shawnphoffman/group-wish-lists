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
	// const data = await getSessionUser()
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

export const getMyPurchases = async () => {
	'use server'

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('view_my_purchases').select()

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const purchases = resp.data?.reduce((acc, p) => {
		if (p.gifter_id === viewingUserID || p.recipient_user_id !== viewingUserID) {
			acc.push(p)
		}
		return acc
	}, [])

	// console.log('getMyLists.resp', resp)

	return purchases
}

export const getMyPurchaseAddons = async () => {
	'use server'

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('view_my_purchases_addons').select()

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const addons = resp.data?.reduce((acc, p) => {
		if (p.gifter_id === viewingUserID || p.recipient_user_id !== viewingUserID) {
			acc.push(p)
		}
		return acc
	}, []) as any[]

	// console.log('getMyPurchaseAddons.resp', addons)

	return addons
}

export const updatePurchaseDetails = async (giftId: number, totalCost: number | null, notes: string | null) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const updateData: { total_cost?: number | null; notes?: string | null } = {}
	if (totalCost !== undefined) {
		updateData.total_cost = totalCost
	}
	if (notes !== undefined) {
		updateData.notes = notes
	}

	const giftPromise = await supabase.from('gifted_items').update(updateData).eq('gift_id', giftId).select()

	await Promise.all([
		giftPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	return {
		status: 'success',
	}
}

/**
 * Add an image to a gift (private receipt image)
 */
export const addGiftImage = async (giftId: number, imageId: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const userId = authData?.user?.id

	if (!userId) {
		return { error: 'User not authenticated' }
	}

	// Verify the user is the gifter for this gift
	const { data: gift, error: giftError } = await supabase.from('gifted_items').select('gifter_id').eq('gift_id', giftId).single()

	if (giftError || !gift) {
		return { error: 'Gift not found' }
	}

	// Verify image belongs to the user
	const { data: image, error: imageError } = await supabase.from('images').select('user_id').eq('id', imageId).single()

	if (imageError || !image) {
		return { error: 'Image not found' }
	}

	if (image.user_id !== userId) {
		return { error: 'Unauthorized' }
	}

	// Create junction record
	const { error: linkError } = await supabase.from('gift_images').insert({
		gift_id: giftId,
		image_id: imageId,
	})

	if (linkError) {
		return { error: linkError.message }
	}

	return { success: true }
}

/**
 * Get all images for a gift (only accessible by the gifter)
 */
export const getGiftImages = async (giftId: number) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const userId = authData?.user?.id

	if (!userId) {
		return { data: null, error: 'User not authenticated' }
	}

	// Verify the user is the gifter
	const { data: gift, error: giftError } = await supabase.from('gifted_items').select('gifter_id').eq('gift_id', giftId).single()

	if (giftError || !gift) {
		return { data: null, error: 'Gift not found' }
	}

	// Verify user is the gifter
	if (gift.gifter_id !== userId) {
		return { data: null, error: 'Unauthorized - only the gifter can view receipt images' }
	}

	// Get images linked to this gift
	const { data, error } = await supabase
		.from('gift_images')
		.select('image_id, images!inner(id, signed_url, storage_path, original_filename, created_at)')
		.eq('gift_id', giftId)
		.order('created_at', { ascending: false })

	return { data, error }
}

/**
 * Remove an image from a gift
 */
export const removeGiftImage = async (giftId: number, imageId: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const userId = authData?.user?.id

	if (!userId) {
		return { error: 'User not authenticated' }
	}

	// Verify the user is the gifter
	const { data: gift, error: giftError } = await supabase.from('gifted_items').select('gifter_id').eq('gift_id', giftId).single()

	if (giftError || !gift) {
		return { error: 'Gift not found' }
	}

	// Remove the junction record
	const { error: deleteError } = await supabase.from('gift_images').delete().eq('gift_id', giftId).eq('image_id', imageId)

	if (deleteError) {
		return { error: deleteError.message }
	}

	return { success: true }
}

export const updatePurchaseAddonDetails = async (addonId: number, totalCost: number | null, notes: string | null) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const updateData: { total_cost?: number | null; notes?: string | null } = {}
	if (totalCost !== undefined) {
		updateData.total_cost = totalCost
	}
	if (notes !== undefined) {
		updateData.notes = notes
	}

	const addonPromise = await supabase.from('list_addons').update(updateData).eq('id', addonId).maybeSingle()

	await Promise.all([
		addonPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 2000)),
	])

	return {
		status: 'success',
	}
}
