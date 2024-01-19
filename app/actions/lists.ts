'use server'

import { cookies } from 'next/headers'

import { List, User } from '@/components/types'

import { createClient } from '@/utils/supabase/server'

const monthToNumber: { [key: string]: number } = {
	january: 1,
	february: 2,
	march: 3,
	april: 4,
	may: 5,
	june: 6,
	july: 7,
	august: 8,
	september: 9,
	october: 10,
	november: 11,
	december: 12,
}

const sortUserGroupsByBirthDate = (a: Partial<User>, b: Partial<User>) => {
	const currentDate = new Date()
	// const currentDate = new Date('July 17, 2024 03:24:00')
	const currentMonth = currentDate.getMonth() + 1
	const currentDay = currentDate.getDate()
	let aMonth = monthToNumber[a.birth_month!]
	if (aMonth < currentMonth) {
		aMonth += 12
	} else if (aMonth === currentMonth && a.birth_day! < currentDay) {
		aMonth += 12
	}

	let bMonth = monthToNumber[b.birth_month!]
	if (bMonth < currentMonth) {
		bMonth += 12
	} else if (bMonth === currentMonth && b.birth_day! < currentDay) {
		bMonth += 12
	}

	if (aMonth <= currentMonth && a.birth_day === currentDay) {
		return -1
	}
	if (bMonth <= currentMonth && b.birth_day === currentDay) {
		return 1
	}

	// console.log({
	// 	aMonth,
	// 	bMonth,
	// 	currentMonth,
	// 	currentDay,
	// 	bDay: b.birth_day,
	// 	aDay: a.birth_day,
	// 	a_month: a.birth_month,
	// 	b_month: b.birth_month,
	// })

	if (aMonth === bMonth) {
		return a.birth_day! - b.birth_day!
	}
	return aMonth! - bMonth!
}

export const getListsGroupedByUser = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase
		.from('view_users')
		.select('id,user_id,email,display_name,birth_month,birth_day,lists:view_sorted_lists(*)')
		.not('lists', 'is', null)
		.order('id', { ascending: true })

	try {
		if (resp.data) {
			resp.data.sort(sortUserGroupsByBirthDate)
		}
	} catch (error) {
		console.error('getListsGroupedByUser.resp.error', error)
	}

	return resp
}

export const getMyLists = async () => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('view_my_lists').select('*')

	// console.log('getMyLists.resp', resp)

	return resp
}

export const getEditableList = async (listID: number) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase
		.from('view_my_lists')
		.select(
			`name,type,active,
			recipient:recipient_user_id(id,display_name,user_id),
			listItems:view_sorted_list_items!list_items_list_id_fkey(*)`
		)
		.eq('id', listID)
		// .not('active', 'is', false)
		.single()

	// console.log('getEditableList.resp', resp)

	return resp
}

export const getViewableList = async (listID: number) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase
		.from('lists')
		.select(
			`name,type,user_id,
			recipient:recipient_user_id(id,display_name,user_id),
			listItems:view_sorted_list_items!list_items_list_id_fkey(*)`
		)
		.eq('id', listID)
		.eq('private', false)
		.not('active', 'is', false)
		.single()

	// console.log('getViewableList.resp', resp)

	return resp
}

export const createList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const type = formData.get('list-type') as string
	const isPrivate = formData.get('list-privacy') as unknown as boolean
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const me = await supabase.from('view_me').select('user_id').single()

	const createPromise = supabase.from('lists').insert({ recipient_user_id: me.data?.user_id, name, active: true, type, private: isPrivate })

	const [list] = await Promise.all([
		createPromise,
		// new Promise(resolve => setTimeout(resolve, 5000))
	])
	// console.log('list', list)

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
