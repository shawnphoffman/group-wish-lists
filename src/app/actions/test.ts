import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const fakeAsync = async (timeout = 2000, status = 'success') => {
	'use server'
	const randomOffset = Math.floor(Math.random() * 2000)
	const randomChoice = Math.random() < 0.5 ? -1 : 1
	const randomTimeout = timeout + randomChoice * randomOffset
	return await new Promise(resolve => {
		setTimeout(() => {
			resolve({
				status,
			})
		}, randomTimeout)
	})
}

export const getUsers = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('users').select('id,user_id,display_name').order('id', { ascending: true })

	// console.log('getUsers.resp', resp)

	return resp as any
}
