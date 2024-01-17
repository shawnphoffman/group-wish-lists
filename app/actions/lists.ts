'use server'

import { cookies } from 'next/headers'

import { List } from '@/components/types'

import { createClient } from '@/utils/supabase/server'

export const getListsGroupedByUser = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const response = await supabase
		.from('view_users')
		.select('id,user_id,email,display_name,lists:view_sorted_lists(*)')
		.not('lists', 'is', null)
		.order('id', { ascending: true })

	return response
}

export const getMyLists = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	return await supabase.from('view_my_lists').select('*')
}

export const getEditableList = async (listID: number) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	return await supabase
		.from('view_my_lists')
		.select('name,type,recipient:recipient_id(id,display_name),listItems:view_sorted_list_items(*)')
		.eq('id', listID)
		.not('active', 'is', false)
		.single()
}

export const getViewableList = async (listID: number) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	return await supabase
		.from('lists')
		.select('name,type,user_id,recipient:recipient_id(id,display_name),listItems:view_sorted_list_items(*)')
		.eq('id', listID)
		.not('active', 'is', false)
		.single()
}

export const createList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const type = formData.get('list-type') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const me = await supabase.from('view_me').select('id').single()

	const createPromise = supabase.from('lists').insert({ recipient_id: me.data?.id, name, active: true, type })

	const [list] = await Promise.all([
		createPromise,
		// new Promise(resolve => setTimeout(resolve, 5000))
	])
	console.log('list', list)

	return {
		status: 'success',
		list,
	}
}

export const renameList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const type = formData.get('list-type') as string
	const id = formData.get('id') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').update({ name, type }).eq('id', id)

	return {
		status: 'success',
	}
}

export const archiveList = async (listID: List['id']) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').update({ active: false }).eq('id', listID)

	return {
		status: 'success',
	}
}

export const unarchiveList = async (listID: List['id']) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').update({ active: true }).eq('id', listID)

	return {
		status: 'success',
	}
}

export const deleteList = async (listID: List['id']) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').delete().eq('id', listID)

	return {
		status: 'success',
	}
}
