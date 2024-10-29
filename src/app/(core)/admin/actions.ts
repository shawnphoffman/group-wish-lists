'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const inviteUser = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const email = formData.get('email') as string
	const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)
	console.log('inviteUser', { data, error })
	if (error || !data?.user) {
		return {
			status: 'error',
			error,
		}
	}

	return {
		status: 'success',
		user: data.user,
	}
}

export const adminArchiveCompletedItems = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const itemsPromise = await supabase
		.from('list_items')
		.update([{ archived: true }])
		.eq('status', 'complete')
		.eq('archived', false)

	const [items] = await Promise.all([
		itemsPromise,
		//
		// new Promise(resolve => setTimeout(resolve, 5000)),
	])

	console.log('adminArchiveCompletedItems', { items, itemsPromise })

	return {
		status: 'success',
		items,
	}
}
