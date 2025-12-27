import sharp from 'sharp'

export type CropMode = 'none' | 'center' | 'smart'

export interface ImageProcessingOptions {
	maxWidth?: number
	maxHeight?: number
	cropMode?: CropMode
	quality?: number
	format?: 'webp' | 'jpeg' | 'png'
}

export interface ProcessedImageResult {
	buffer: Buffer
	width: number
	height: number
	size: number
	mimeType: string
	format: string
}

/**
 * Process an image with resize, crop, and optimization
 */
export async function processImage(input: Buffer | Uint8Array, options: ImageProcessingOptions = {}): Promise<ProcessedImageResult> {
	const { maxWidth = 800, maxHeight = 800, cropMode = 'none', quality = 80, format = 'webp' } = options

	// Get image metadata
	const metadata = await sharp(input).metadata()
	const originalWidth = metadata.width || 0
	const originalHeight = metadata.height || 0
	const hasAlpha = metadata.hasAlpha || false
	const inputFormat = metadata.format

	// Start with input and ensure we preserve alpha channel
	// Use keepMetadata to preserve color space and alpha channel information
	let pipeline = sharp(input).keepMetadata()

	// Always ensure alpha channel is available if:
	// 1. Input has alpha, OR
	// 2. Input format supports transparency (webp, png), OR
	// 3. Output format supports transparency (webp, png)
	if (hasAlpha || inputFormat === 'webp' || inputFormat === 'png' || format === 'webp' || format === 'png') {
		pipeline = pipeline.ensureAlpha()
	}

	// Determine target dimensions
	let targetWidth = maxWidth
	let targetHeight = maxHeight

	if (cropMode === 'none') {
		// Maintain aspect ratio, fit within bounds
		const aspectRatio = originalWidth / originalHeight
		if (originalWidth > originalHeight) {
			targetHeight = Math.round(maxWidth / aspectRatio)
			if (targetHeight > maxHeight) {
				targetHeight = maxHeight
				targetWidth = Math.round(maxHeight * aspectRatio)
			}
		} else {
			targetWidth = Math.round(maxHeight * aspectRatio)
			if (targetWidth > maxWidth) {
				targetWidth = maxWidth
				targetHeight = Math.round(maxWidth / aspectRatio)
			}
		}
		// For 'inside' fit, no background padding is added, so we don't need to specify background
		// The alpha channel will be preserved automatically if ensureAlpha() was called
		pipeline = pipeline.resize(targetWidth, targetHeight, {
			fit: 'inside',
			withoutEnlargement: true,
		})
	} else if (cropMode === 'center') {
		// Crop to exact dimensions, centered
		pipeline = pipeline.resize(targetWidth, targetHeight, {
			fit: 'cover',
			position: 'center',
			withoutEnlargement: false,
			background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background for crop
		})
	} else if (cropMode === 'smart') {
		// Use smart crop (entropy-based)
		pipeline = pipeline.resize(targetWidth, targetHeight, {
			fit: 'cover',
			position: 'entropy',
			withoutEnlargement: false,
			background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background for crop
		})
	}

	// Convert format and apply quality
	if (format === 'webp') {
		// Preserve transparency for WebP - ensure alpha is always included
		const webpOptions: any = {
			quality,
			lossless: false, // Use lossy compression but preserve alpha
		}
		// If input has alpha or we ensured it, make sure WebP preserves it
		if (hasAlpha || inputFormat === 'webp' || inputFormat === 'png') {
			// WebP will automatically preserve alpha if present
			// No need to set additional options
		}
		pipeline = pipeline.webp(webpOptions)
	} else if (format === 'jpeg') {
		// JPEG doesn't support transparency, so convert to RGB if needed
		if (hasAlpha) {
			pipeline = pipeline.removeAlpha()
		}
		pipeline = pipeline.jpeg({ quality, mozjpeg: true })
	} else if (format === 'png') {
		// PNG preserves transparency naturally
		pipeline = pipeline.png({
			quality: Math.min(quality, 100),
			compressionLevel: 9,
		})
	}

	// Process the image
	const buffer = await pipeline.toBuffer()
	const processedMetadata = await sharp(buffer).metadata()

	const mimeType = format === 'webp' ? 'image/webp' : format === 'jpeg' ? 'image/jpeg' : 'image/png'

	return {
		buffer,
		width: processedMetadata.width || targetWidth,
		height: processedMetadata.height || targetHeight,
		size: buffer.length,
		mimeType,
		format,
	}
}

/**
 * Convert a File or Blob to Buffer for processing
 */
export async function fileToBuffer(file: File | Blob): Promise<Buffer> {
	const arrayBuffer = await file.arrayBuffer()
	return Buffer.from(arrayBuffer)
}
