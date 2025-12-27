'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import { faSpinner, faUpload, faXmark } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cropper, { Area, Point } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'

import { uploadItemImage } from '@/app/actions/images'
import type { ImageProcessingOptions } from '@/utils/image-processing'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ItemImage from './ItemImage'

type Props = {
	onImageUploaded: (url: string, imageId?: string) => void
	currentImageUrl?: string
	listItemId?: string
}

// Helper function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image()
		image.addEventListener('load', () => resolve(image))
		image.addEventListener('error', error => reject(error))
		image.src = url
	})

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
	const image = await createImage(imageSrc)
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d', { alpha: true })

	if (!ctx) {
		throw new Error('No 2d context')
	}

	// Set canvas size to match the cropped area
	canvas.width = pixelCrop.width
	canvas.height = pixelCrop.height

	// Clear the canvas to ensure transparent background
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// Draw the cropped image
	ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

	// Convert canvas to blob with transparency support
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			blob => {
				if (!blob) {
					reject(new Error('Canvas is empty'))
					return
				}
				resolve(blob)
			},
			'image/webp',
			0.95
		)
	})
}

export default function ImageUploader({ onImageUploaded, currentImageUrl, listItemId }: Props) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [showCropDialog, setShowCropDialog] = useState(false)
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [aspectRatioValue, setAspectRatioValue] = useState<string>('free')
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
	const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

	// Convert aspect ratio string to number
	const aspectRatio = useMemo(() => {
		if (aspectRatioValue === 'free') return undefined
		if (aspectRatioValue === '1') return 1
		if (aspectRatioValue === '4/3') return 4 / 3
		if (aspectRatioValue === '16/9') return 16 / 9
		if (aspectRatioValue === '3/4') return 3 / 4
		return undefined
	}, [aspectRatioValue])
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setSelectedFile(file)
			setUploadError(null)
			// Create preview
			const reader = new FileReader()
			reader.onloadend = () => {
				const result = reader.result as string
				setPreviewUrl(result)
				// Open crop dialog automatically
				setShowCropDialog(true)
			}
			reader.readAsDataURL(file)
		}
	}, [])

	const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}, [])

	const handleCropAndUpload = useCallback(async () => {
		if (!previewUrl || !croppedAreaPixels) {
			setUploadError('Please adjust the crop area')
			return
		}

		setIsUploading(true)
		setUploadError(null)

		try {
			// Create cropped image blob
			const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels)
			const croppedFile = new File([croppedBlob], selectedFile?.name || 'cropped-image.webp', {
				type: 'image/webp',
			})

			const options: ImageProcessingOptions & { listItemId?: string } = {
				maxWidth: 1000,
				maxHeight: 1000,
				cropMode: 'none', // Already cropped, so use 'none'
				listItemId,
			}

			const result = await uploadItemImage(croppedFile, options)

			if (result.error) {
				setUploadError(result.error)
			} else if (result.url) {
				onImageUploaded(result.url, result.imageId)
				// Reset state
				setSelectedFile(null)
				setPreviewUrl(null)
				setShowCropDialog(false)
				setCrop({ x: 0, y: 0 })
				setZoom(1)
				setCroppedAreaPixels(null)
				if (fileInputRef.current) {
					fileInputRef.current.value = ''
				}
			}
		} catch (error) {
			console.error('ImageUploader.cropError', error)
			setUploadError(error instanceof Error ? error.message : 'Failed to crop and upload image')
		} finally {
			setIsUploading(false)
		}
	}, [previewUrl, croppedAreaPixels, selectedFile, listItemId, onImageUploaded])

	const handleClear = useCallback(() => {
		setSelectedFile(null)
		setPreviewUrl(null)
		setUploadError(null)
		setShowCropDialog(false)
		setCrop({ x: 0, y: 0 })
		setZoom(1)
		setCroppedAreaPixels(null)
		if (previewImageUrl) {
			URL.revokeObjectURL(previewImageUrl)
			setPreviewImageUrl(null)
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}, [previewImageUrl])

	const handleCloseCropDialog = useCallback(() => {
		setShowCropDialog(false)
		if (previewImageUrl) {
			URL.revokeObjectURL(previewImageUrl)
			setPreviewImageUrl(null)
		}
	}, [previewImageUrl])

	const handlePreview = useCallback(async () => {
		if (!previewUrl || !croppedAreaPixels) {
			setUploadError('Please adjust the crop area first')
			return
		}

		setIsGeneratingPreview(true)
		try {
			const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels)
			const previewImageUrl = URL.createObjectURL(croppedBlob)
			setPreviewImageUrl(previewImageUrl)
		} catch (error) {
			console.error('ImageUploader.previewError', error)
			setUploadError(error instanceof Error ? error.message : 'Failed to generate preview')
		} finally {
			setIsGeneratingPreview(false)
		}
	}, [previewUrl, croppedAreaPixels])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<Label htmlFor="image-upload">Upload Image</Label>
				<input type="file" id="image-upload" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
				<div className="flex gap-2">
					<Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
						<FontAwesomeIcon icon={faUpload} className="mr-2" />
						Choose File
					</Button>
					{selectedFile && !showCropDialog && (
						<Button type="button" variant="ghost" onClick={handleClear} disabled={isUploading}>
							<FontAwesomeIcon icon={faXmark} />
						</Button>
					)}
				</div>
				{selectedFile && (
					<p className="text-sm text-muted-foreground">
						Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
					</p>
				)}
			</div>

			{uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

			{/* Crop Dialog */}
			<Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
				<DialogContent className="w-full max-w-4xl p-0">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>Crop Image</DialogTitle>
						<DialogDescription>Adjust the crop area by dragging and zooming. Pinch to zoom on mobile devices.</DialogDescription>
					</DialogHeader>
					<div className="relative w-full" style={{ height: '400px', minHeight: '300px' }}>
						{previewUrl && (
							<Cropper
								image={previewUrl}
								crop={crop}
								zoom={zoom}
								minZoom={0.5}
								maxZoom={3}
								aspect={aspectRatio}
								restrictPosition={zoom >= 1}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
								style={{
									containerStyle: {
										width: '100%',
										height: '100%',
										position: 'relative',
										backgroundColor: 'transparent',
									},
								}}
							/>
						)}
					</div>
					<div className="px-6 pb-4">
						<div className="flex flex-col gap-4 mb-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="zoom-slider">Zoom: {zoom.toFixed(2)}x</Label>
								<input
									id="zoom-slider"
									type="range"
									min={0.5}
									max={3}
									step={0.1}
									value={zoom}
									onChange={e => setZoom(Number(e.target.value))}
									className="w-full"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="aspect-ratio-crop">Aspect Ratio</Label>
								<Select value={aspectRatioValue} onValueChange={setAspectRatioValue}>
									<SelectTrigger id="aspect-ratio-crop">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="free">Free (No restriction)</SelectItem>
										<SelectItem value="1">Square (1:1)</SelectItem>
										<SelectItem value="4/3">4:3</SelectItem>
										<SelectItem value="16/9">16:9</SelectItem>
										<SelectItem value="3/4">3:4 (Portrait)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					{previewImageUrl && (
						<div className="px-6 pb-4 border-t">
							<div className="flex flex-col gap-2 mt-4">
								<Label>Preview</Label>
								<div className="relative flex justify-center w-full">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={previewImageUrl} alt="Preview" className="object-contain max-w-full rounded-lg max-h-64" />
								</div>
							</div>
						</div>
					)}
					<DialogFooter className="px-6 pb-6">
						<Button type="button" variant="outline" onClick={handleCloseCropDialog} disabled={isUploading}>
							Cancel
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={handlePreview}
							disabled={isGeneratingPreview || !croppedAreaPixels || isUploading}
						>
							{isGeneratingPreview ? (
								<>
									<FontAwesomeIcon icon={faSpinner} pulse className="mr-2" />
									Generating...
								</>
							) : (
								'Preview'
							)}
						</Button>
						<Button type="button" onClick={handleCropAndUpload} disabled={isUploading || !croppedAreaPixels}>
							{isUploading ? (
								<>
									<FontAwesomeIcon icon={faSpinner} pulse className="mr-2" />
									Uploading...
								</>
							) : (
								'Upload Cropped Image'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
