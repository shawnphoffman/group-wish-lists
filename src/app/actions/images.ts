'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

const fiveYearsInSeconds = 5 * 365 * 24 * 60 * 60

// TODO - Error handling
export const saveImageFromUrl = async (url: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	try {
		const response = await fetch(url)
		const blob = await response.blob()

		// Determine file extension from blob type or URL
		let extension = 'jpg' // default
		if (blob.type) {
			const mimeToExt: Record<string, string> = {
				'image/jpeg': 'jpg',
				'image/jpg': 'jpg',
				'image/png': 'png',
				'image/gif': 'gif',
				'image/webp': 'webp',
				'image/svg+xml': 'svg',
			}
			extension = mimeToExt[blob.type] || extension
		} else {
			// Fallback: try to extract from URL
			const urlMatch = url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i)
			if (urlMatch) {
				extension = urlMatch[1].toLowerCase()
			}
		}

		const imageKey = `${crypto.randomUUID()}.${extension}`
		const { data, error } = await supabase.storage.from('images').upload(`items/${imageKey}`, blob, { cacheControl: '3600', upsert: false })

		if (error) {
			console.error('saveImageFromUrl.error', error)
			throw new Error('saveImageFromUrl.error', { cause: error })
		}

		if (!data) {
			throw new Error('saveImageFromUrl.error: No data returned from upload')
		}

		// Use the fullPath from the upload response instead of just the path
		const { data: signedData, error: signedError } = await supabase.storage
			.from('images')
			.createSignedUrl(data.fullPath.replace('images/', ''), fiveYearsInSeconds, {
				transform: {
					quality: 80,
					width: 400,
					height: 400,
				},
			})

		if (signedError) {
			console.error('saveImageFromUrl.signedError', signedError)
			throw new Error('saveImageFromUrl.signedError', { cause: signedError })
		}

		return signedData.signedUrl
	} catch (error) {
		console.error('saveImageFromUrl.error', error)
		throw new Error('saveImageFromUrl.error', { cause: error })
	}
}

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
