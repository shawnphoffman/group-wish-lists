'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

const fiveYearsInSeconds = 5 * 365 * 24 * 60 * 60

export const uploadAvatar = async (file: File) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const userId = authData?.user?.id

	const { data, error } = await supabase.storage.from('images').upload(`users/${file.name}`, file, { cacheControl: '3600', upsert: false })

	if (error) {
		console.error('uploadAvatar.error', error)
		return {
			error: error.message,
		}
	}

	// console.log('uploadAvatar.data', data)

	// Use the fullPath from the upload response instead of just the path
	const { data: signedData, error: signedError } = await supabase.storage
		.from('images')
		.createSignedUrl(data.fullPath.replace('images/', ''), fiveYearsInSeconds, {
			transform: {
				quality: 80,
				width: 200,
				height: 200,
			},
		})

	if (signedError) {
		console.error('uploadAvatar.signedError', signedError)
		return {
			error: signedError.message,
		}
	}

	// console.log('uploadAvatar.signedData', signedData)

	const url = signedData.signedUrl

	const { data: user, error: userError } = await supabase.from('users').update({ image: url }).eq('user_id', userId)

	if (userError) {
		console.error('uploadAvatar.userError', userError)
		return {
			error: userError.message,
		}
	}

	// console.log('uploadAvatar.user', user)

	return {
		url,
	}
}
