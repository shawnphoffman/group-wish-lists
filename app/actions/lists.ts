'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const createList = async (prevState: any, formData: FormData) => {
	'use server'
	const type = formData.get('list-type') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').insert([{ name, active: true, type }])

	return {
		status: 'success',
	}
}

export const renameList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const id = formData.get('id') as string
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').update({ name }).eq('id', id)

	return {
		status: 'success',
	}
}

export const archiveList = async (listID: string) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').update({ active: false }).eq('id', listID)

	return {
		status: 'success',
	}
}

export const unarchiveList = async (listID: string) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').update({ active: true }).eq('id', listID)

	return {
		status: 'success',
	}
}

export const deleteList = async (listID: string) => {
	'use server'
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from('lists').delete().eq('id', listID)

	return {
		status: 'success',
	}
}
