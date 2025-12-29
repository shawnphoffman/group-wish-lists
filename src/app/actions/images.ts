'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'
import { processImage, fileToBuffer, type ImageProcessingOptions } from '@/utils/image-processing'

const fiveYearsInSeconds = 5 * 365 * 24 * 60 * 60

/**
 * Helper function to create signed URL for an image
 */
async function createSignedUrl(
	supabase: ReturnType<typeof createClient>,
	storagePath: string,
	transform?: { width?: number; height?: number; quality?: number }
) {
	const pathWithoutBucket = storagePath.replace('images/', '')
	const { data: signedData, error: signedError } = await supabase.storage
		.from('images')
		.createSignedUrl(pathWithoutBucket, fiveYearsInSeconds, {
			transform: transform
				? {
						quality: transform.quality || 80,
						width: transform.width,
						height: transform.height,
					}
				: undefined,
		})

	if (signedError) {
		throw new Error('Failed to create signed URL', { cause: signedError })
	}

	return signedData.signedUrl
}

/**
 * Save image from URL with processing and tracking
 */
export const saveImageFromUrl = async (url: string, options?: ImageProcessingOptions) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	try {
		const { data: authData } = await supabase.auth.getUser()
		const userId = authData?.user?.id

		if (!userId) {
			throw new Error('User not authenticated')
		}

		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`)
		}

		const arrayBuffer = await response.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		// Process image with sharp
		const processed = await processImage(buffer, {
			maxWidth: 800,
			maxHeight: 800,
			cropMode: 'none',
			quality: 80,
			format: 'webp',
			...options,
		})

		// Determine file extension
		const extension = processed.format === 'webp' ? 'webp' : processed.format === 'jpeg' ? 'jpg' : 'png'
		const imageKey = `${crypto.randomUUID()}.${extension}`
		const storagePath = `items/${imageKey}`

		// Upload processed image
		const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(storagePath, processed.buffer, {
			cacheControl: '3600',
			upsert: false,
			contentType: processed.mimeType,
		})

		if (uploadError) {
			console.error('saveImageFromUrl.uploadError', uploadError)
			throw new Error('Failed to upload image', { cause: uploadError })
		}

		if (!uploadData) {
			throw new Error('No data returned from upload')
		}

		// Create signed URL
		const signedUrl = await createSignedUrl(supabase, uploadData.fullPath, {
			width: 400,
			height: 400,
			quality: 80,
		})

		// Create image record
		const { data: imageRecord, error: recordError } = await supabase
			.from('images')
			.insert({
				user_id: userId,
				storage_path: storagePath,
				signed_url: signedUrl,
				file_size: processed.size,
				mime_type: processed.mimeType,
				width: processed.width,
				height: processed.height,
				source_type: 'url',
			})
			.select()
			.single()

		if (recordError) {
			console.error('saveImageFromUrl.recordError', recordError)
			// Don't fail if record creation fails, but log it
		}

		return {
			url: signedUrl,
			imageId: imageRecord?.id,
		}
	} catch (error) {
		console.error('saveImageFromUrl.error', error)
		throw error instanceof Error ? error : new Error('Failed to save image from URL', { cause: error })
	}
}

/**
 * Upload avatar with processing and tracking
 */
export const uploadAvatar = async (file: File) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const userId = authData?.user?.id

	if (!userId) {
		return {
			error: 'User not authenticated',
		}
	}

	try {
		// Convert file to buffer and process
		const buffer = await fileToBuffer(file)
		const processed = await processImage(buffer, {
			maxWidth: 200,
			maxHeight: 200,
			cropMode: 'center',
			quality: 80,
			format: 'webp',
		})

		// Generate unique filename
		const extension = processed.format === 'webp' ? 'webp' : processed.format === 'jpeg' ? 'jpg' : 'png'
		const imageKey = `${crypto.randomUUID()}.${extension}`
		const storagePath = `users/${imageKey}`

		// Upload processed image
		const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(storagePath, processed.buffer, {
			cacheControl: '3600',
			upsert: false,
			contentType: processed.mimeType,
		})

		if (uploadError) {
			console.error('uploadAvatar.uploadError', uploadError)
			return {
				error: uploadError.message,
			}
		}

		if (!uploadData) {
			return {
				error: 'No data returned from upload',
			}
		}

		// Create signed URL
		const signedUrl = await createSignedUrl(supabase, uploadData.fullPath, {
			width: 200,
			height: 200,
			quality: 80,
		})

		// Create image record
		const { data: imageRecord, error: recordError } = await supabase
			.from('images')
			.insert({
				user_id: userId,
				storage_path: storagePath,
				signed_url: signedUrl,
				file_size: processed.size,
				mime_type: processed.mimeType,
				width: processed.width,
				height: processed.height,
				original_filename: file.name,
				source_type: 'avatar',
			})
			.select()
			.single()

		if (recordError) {
			console.error('uploadAvatar.recordError', recordError)
			// Continue even if record creation fails
		}

		// Update user record
		const { error: userError } = await supabase.from('users').update({ image: signedUrl }).eq('user_id', userId)

		if (userError) {
			console.error('uploadAvatar.userError', userError)
			return {
				error: userError.message,
			}
		}

		return {
			url: signedUrl,
			imageId: imageRecord?.id,
		}
	} catch (error) {
		console.error('uploadAvatar.error', error)
		return {
			error: error instanceof Error ? error.message : 'Failed to upload avatar',
		}
	}
}

/**
 * Upload item image from file with configurable processing options
 */
export const uploadItemImage = async (
	file: File,
	options?: ImageProcessingOptions & { listItemId?: string; sourceType?: string }
): Promise<{ url?: string; imageId?: string; error?: string }> => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const userId = authData?.user?.id

	if (!userId) {
		return {
			error: 'User not authenticated',
		}
	}

	try {
		// Convert file to buffer and process
		const buffer = await fileToBuffer(file)
		const processed = await processImage(buffer, {
			maxWidth: 800,
			maxHeight: 800,
			cropMode: 'none',
			quality: 80,
			format: 'webp',
			...options,
		})

		// Generate unique filename
		const extension = processed.format === 'webp' ? 'webp' : processed.format === 'jpeg' ? 'jpg' : 'png'
		const imageKey = `${crypto.randomUUID()}.${extension}`
		const storagePath = `items/${imageKey}`

		// Upload processed image
		const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(storagePath, processed.buffer, {
			cacheControl: '3600',
			upsert: false,
			contentType: processed.mimeType,
		})

		if (uploadError) {
			console.error('uploadItemImage.uploadError', uploadError)
			return {
				error: uploadError.message,
			}
		}

		if (!uploadData) {
			return {
				error: 'No data returned from upload',
			}
		}

		// Create signed URL
		const signedUrl = await createSignedUrl(supabase, uploadData.fullPath, {
			width: 400,
			height: 400,
			quality: 80,
		})

		// Create image record
		const { data: imageRecord, error: recordError } = await supabase
			.from('images')
			.insert({
				user_id: userId,
				storage_path: storagePath,
				signed_url: signedUrl,
				file_size: processed.size,
				mime_type: processed.mimeType,
				width: processed.width,
				height: processed.height,
				original_filename: file.name,
				source_type: options?.sourceType || 'file',
			})
			.select()
			.single()

		if (recordError) {
			console.error('uploadItemImage.recordError', recordError)
			return {
				error: recordError.message,
			}
		}

		// Optionally link to list item
		if (options?.listItemId && imageRecord?.id) {
			const { error: linkError } = await supabase.from('list_item_images').insert({
				list_item_id: options.listItemId,
				image_id: imageRecord.id,
			})

			if (linkError) {
				console.error('uploadItemImage.linkError', linkError)
				// Don't fail if linking fails
			}
		}

		return {
			url: signedUrl,
			imageId: imageRecord?.id,
		}
	} catch (error) {
		console.error('uploadItemImage.error', error)
		return {
			error: error instanceof Error ? error.message : 'Failed to upload image',
		}
	}
}

/**
 * Get all images uploaded by a user
 */
export const getImagesByUser = async (userId?: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const targetUserId = userId || authData?.user?.id

	if (!targetUserId) {
		return { data: null, error: 'User not authenticated' }
	}

	const { data, error } = await supabase.from('images').select('*').eq('user_id', targetUserId).order('created_at', { ascending: false })

	return { data, error }
}

/**
 * Get usage information for an image (which items use it)
 */
export const getImageUsage = async (imageId: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('list_item_images')
		.select('list_item_id, list_items(id, title, list_id)')
		.eq('image_id', imageId)

	return { data, error }
}

/**
 * Delete an image and its storage file
 */
export const deleteImage = async (imageId: string) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: authData } = await supabase.auth.getUser()
	const userId = authData?.user?.id

	if (!userId) {
		return { error: 'User not authenticated' }
	}

	// Get image record to verify ownership and get storage path
	const { data: imageRecord, error: fetchError } = await supabase.from('images').select('*').eq('id', imageId).single()

	if (fetchError || !imageRecord) {
		return { error: 'Image not found' }
	}

	// Verify ownership
	if (imageRecord.user_id !== userId) {
		return { error: 'Unauthorized' }
	}

	// Delete from storage
	const { error: storageError } = await supabase.storage.from('images').remove([imageRecord.storage_path])

	if (storageError) {
		console.error('deleteImage.storageError', storageError)
		// Continue with database deletion even if storage deletion fails
	}

	// Delete image record (cascade will handle list_item_images)
	const { error: deleteError } = await supabase.from('images').delete().eq('id', imageId)

	if (deleteError) {
		return { error: deleteError.message }
	}

	return { success: true }
}
