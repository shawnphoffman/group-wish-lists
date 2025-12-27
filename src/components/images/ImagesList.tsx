'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { faTrash, faSpinner } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'

import { getImagesByUser, deleteImage, getImageUsage } from '@/app/actions/images'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ItemImage from '@/components/items/components/ItemImage'
import ImageUploader from '@/components/items/components/ImageUploader'

type ImageRecord = {
	id: string
	user_id: string
	storage_path: string
	signed_url: string | null
	file_size: number
	mime_type: string
	width: number | null
	height: number | null
	original_filename: string | null
	source_type: string
	created_at: string
}

export default function ImagesList() {
	const [images, setImages] = useState<ImageRecord[]>([])
	const [loading, setLoading] = useState(true)
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [usageData, setUsageData] = useState<Record<string, number>>({})
	const router = useRouter()

	useEffect(() => {
		loadImages()
	}, [])

	const loadImages = async () => {
		setLoading(true)
		try {
			const { data, error } = await getImagesByUser()
			if (error) {
				console.error('Failed to load images:', error)
			} else if (data) {
				setImages(data)
				// Load usage data for each image
				const usagePromises = data.map(async (img: ImageRecord) => {
					const { data: usage } = await getImageUsage(img.id)
					return { id: img.id, count: usage?.length || 0 }
				})
				const usageResults = await Promise.all(usagePromises)
				const usageMap: Record<string, number> = {}
				usageResults.forEach(({ id, count }) => {
					usageMap[id] = count
				})
				setUsageData(usageMap)
			}
		} catch (error) {
			console.error('Error loading images:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (imageId: string) => {
		setDeletingId(imageId)
		try {
			const result = await deleteImage(imageId)
			if (result.error) {
				console.error('Failed to delete image:', result.error)
				alert(`Failed to delete image: ${result.error}`)
			} else {
				setImages(images.filter(img => img.id !== imageId))
				router.refresh()
			}
		} catch (error) {
			console.error('Error deleting image:', error)
			alert('Failed to delete image')
		} finally {
			setDeletingId(null)
		}
	}

	const handleImageUploaded = (url: string, imageId?: string) => {
		// Reload the images list after upload
		loadImages()
		router.refresh()
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<FontAwesomeIcon icon={faSpinner} pulse size="2x" />
			</div>
		)
	}

	return (
		<div className="grid gap-4">
			{/* Upload Section */}
			<div className="p-4 border rounded-lg bg-background">
				<h3 className="mb-4 text-lg font-semibold">Upload New Image</h3>
				<ImageUploader onImageUploaded={handleImageUploaded} />
			</div>

			{/* Images List */}
			{images.length === 0 ? (
				<p className="text-muted-foreground py-8 text-center">No images uploaded yet. Upload your first image above.</p>
			) : (
				<>
					<Separator />
					<div className="grid gap-4">
						{images.map(image => (
							<div key={image.id} className="flex items-start gap-4 p-4 border rounded-lg">
								<div className="flex-shrink-0">
									<ItemImage url={image.signed_url || undefined} className="w-24 h-24" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">{image.original_filename || image.storage_path.split('/').pop()}</p>
											<div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
												<span>{image.width && image.height ? `${image.width} × ${image.height}` : 'Unknown dimensions'}</span>
												<span>{formatFileSize(image.file_size)}</span>
												<span>{format(new Date(image.created_at), 'MMM d, yyyy')}</span>
												<span className="capitalize">{image.source_type}</span>
												{usageData[image.id] !== undefined && (
													<span className="font-medium">
														Used in {usageData[image.id]} item{usageData[image.id] !== 1 ? 's' : ''}
													</span>
												)}
											</div>
										</div>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="destructive" size="sm" disabled={deletingId === image.id}>
													{deletingId === image.id ? <FontAwesomeIcon icon={faSpinner} pulse /> : <FontAwesomeIcon icon={faTrash} />}
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Delete Image?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete the image from storage. If it&apos;s being used by any list items, those items will
														lose their image. This action cannot be undone.
														{usageData[image.id] > 0 && (
															<span className="block mt-2 font-semibold text-destructive">
																Warning: This image is used in {usageData[image.id]} item{usageData[image.id] !== 1 ? 's' : ''}.
															</span>
														)}
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction onClick={() => handleDelete(image.id)} className="bg-destructive text-destructive-foreground">
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}
