'use client'

import { startTransition, useState, useEffect } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'

import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import { Gift, ListItem, Purchase } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import MarkdownBlock from './components/MarkdownBlock'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from '@/components/types'
import { updatePurchaseDetails, addGiftImage, getGiftImages, removeGiftImage } from '@/app/actions/gifts'
import { getSessionUser } from '@/app/actions/auth'

import { formatDateBasedOnAge } from '@/utils/date'
import { ItemPriority } from '@/utils/enums'
import Link from 'next/link'
import { EditIcon } from '../icons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faNoteSticky, faTrash, faReceipt } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { cn } from '@/utils/utils'
// import ImageUploader from './components/ImageUploader'
// import ItemImage from './components/ItemImage'

type Props = {
	item: ListItem & Gift & Purchase
	recipient?: User | null
}

export const PurchaseDate = ({ purchaseDate }: { purchaseDate: string | null }) => {
	if (!purchaseDate) return null
	return <Badge variant="secondary">{formatDateBasedOnAge(purchaseDate)}</Badge>
}

export const TotalCost = ({ totalCost, className }: { totalCost: number | undefined | null; className?: string }) => {
	if (totalCost === undefined || totalCost === null) return null
	const totalCostValue = totalCost.toFixed(2)
	const bgColor = totalCost > 0 ? 'bg-green-800' : 'bg-muted'
	return (
		<Badge variant="outline" className={cn('text-[10px]', bgColor, className)}>
			${totalCostValue}
		</Badge>
	)
}

export const PurchaseNotes = ({ notes }: { notes: string }) => {
	return (
		<div className="flex items-center gap-1 px-2 py-1 text-sm italic break-words border border-dashed rounded text-balance w-fit border-amber-500/25 text-muted-foreground">
			<FontAwesomeIcon icon={faNoteSticky} className="text-amber-500" />
			<MarkdownBlock>{notes}</MarkdownBlock>
		</div>
	)
}

export default function PurchaseRow({ item, recipient }: Props) {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [totalCost, setTotalCost] = useState<string>(item.total_cost?.toString() || '')
	const [notes, setNotes] = useState<string>(item.gifted_notes || '')
	const [isLoading, setIsLoading] = useState(false)
	const [giftImages, setGiftImages] = useState<
		Array<{ image_id: string; images: { id: string; signed_url: string; original_filename: string | null } }>
	>([])
	const [isLoadingImages, setIsLoadingImages] = useState(false)
	const [currentUserId, setCurrentUserId] = useState<string | null>(null)

	// Get current user ID on mount (user.id is the UUID from auth.users)
	useEffect(() => {
		getSessionUser().then(user => {
			if (user?.id) {
				setCurrentUserId(user.id)
			}
		})
	}, [])

	// const loadGiftImages = React.useCallback(async () => {
	// 	setIsLoadingImages(true)
	// 	try {
	// 		const { data, error } = await getGiftImages(item.gift_id)
	// 		if (error) {
	// 			console.error('Failed to load gift images:', error)
	// 		} else if (data) {
	// 			setGiftImages(data as any)
	// 		}
	// 	} catch (error) {
	// 		console.error('Error loading gift images:', error)
	// 	} finally {
	// 		setIsLoadingImages(false)
	// 	}
	// }, [item.gift_id])

	// // Load gift images when dialog opens
	// useEffect(() => {
	// 	if (isDialogOpen && currentUserId && item.gifter_id && String(item.gifter_id) === String(currentUserId)) {
	// 		loadGiftImages()
	// 	}
	// }, [isDialogOpen, currentUserId, item.gift_id, item.gifter_id, loadGiftImages])

	if (!item) return null

	const purchaseDate = item?.gift_created_at ? new Date(item.gift_created_at).toDateString() : null
	// gifter_id is a UUID string from auth.users, compare with currentUserId (also UUID string)
	const isGifter = currentUserId && item.gifter_id && String(item.gifter_id) === String(currentUserId)

	const handleSave = async () => {
		setIsLoading(true)
		try {
			const costValue = totalCost.trim() === '' ? null : parseFloat(totalCost)
			const notesValue = notes.trim() === '' ? null : notes.trim()

			// Validate cost is a valid number if provided
			if (costValue !== null && (isNaN(costValue) || costValue < 0)) {
				console.error('Invalid cost value')
				setIsLoading(false)
				return
			}

			await updatePurchaseDetails(item.gift_id, costValue, notesValue)
			setIsDialogOpen(false)
			startTransition(() => {
				router.refresh()
			})
		} catch (error) {
			console.error('Failed to update purchase details:', error)
		} finally {
			setIsLoading(false)
		}
	}

	// const handleImageUploaded = async (url: string, imageId?: string) => {
	// 	if (!imageId) {
	// 		console.error('No image ID returned from upload')
	// 		return
	// 	}

	// 	try {
	// 		const result = await addGiftImage(item.gift_id, imageId)
	// 		if (result.error) {
	// 			console.error('Failed to link image to gift:', result.error)
	// 		} else {
	// 			// Reload images
	// 			loadGiftImages()
	// 		}
	// 	} catch (error) {
	// 		console.error('Error linking image to gift:', error)
	// 	}
	// }

	// const handleRemoveImage = async (imageId: string) => {
	// 	try {
	// 		const result = await removeGiftImage(item.gift_id, imageId)
	// 		if (result.error) {
	// 			console.error('Failed to remove image:', result.error)
	// 		} else {
	// 			// Reload images
	// 			loadGiftImages()
	// 		}
	// 	} catch (error) {
	// 		console.error('Error removing image:', error)
	// 	}
	// }

	return (
		<>
			<div className="flex flex-col w-full gap-2 p-3 hover:bg-muted" id={`gift-${item.gift_id}`}>
				<div className="flex flex-col w-full gap-2 sm:flex-row">
					{/* Recipient */}
					<div className="flex flex-row items-center justify-between gap-1">
						<div className="flex flex-row items-center gap-1">
							{recipient && (
								<Badge variant="outline" className="gap-1 py-0 ps-0 pe-2">
									<Avatar className="border w-7 h-7">
										<AvatarImage src={recipient.image} />
										<AvatarFallback className="text-xl font-bold bg-background text-foreground">
											{recipient.display_name?.charAt(0)}
										</AvatarFallback>
									</Avatar>
									{item.recipient_display_name}
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-1 sm:hidden">
							<TotalCost totalCost={item.total_cost} />
							<PurchaseDate purchaseDate={purchaseDate} />
						</div>
					</div>
					<div className="flex flex-row items-stretch gap-x-3.5 flex-1">
						{item.priority !== ItemPriority.Normal && (
							<div className="flex flex-col items-center justify-center gap-2 shrink-0">
								{/* Priority */}
								<ItemPriorityIcon priority={item.priority} />
							</div>
						)}
						{/*  */}
						<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
							{/* Title + Notes */}
							<div className="flex flex-col flex-1">
								{/* Title */}
								{item.url ? (
									<Link href={item.url!} target="_blank" className={`flex flex-col gap-0.5 overflow-hidden hover:underline`}>
										{item.title}
									</Link>
								) : (
									<div>{item.title}</div>
								)}
								{/* Notes */}
								{item.notes && (
									<div className="text-sm break-words text-foreground/75">
										<MarkdownBlock>{item.notes}</MarkdownBlock>
									</div>
								)}
							</div>

							{/* {isGifter && giftImages.length > 0 && (
								<div className="flex flex-shrink-0 gap-1">
									{giftImages.slice(0, 2).map(giftImage => (
										<ItemImage key={giftImage.image_id} url={giftImage.images.signed_url} className="w-12 h-12" />
									))}
									{giftImages.length > 2 && (
										<div className="flex items-center justify-center w-12 h-12 text-xs font-bold border rounded-lg bg-muted">
											+{giftImages.length - 2}
										</div>
									)}
								</div>
							)} */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									setTotalCost(item.total_cost?.toString() || '')
									setNotes(item.gifted_notes || '')
									setIsDialogOpen(true)
								}}
								className="sm:hidden shrink-0"
							>
								<EditIcon />
							</Button>
						</div>
					</div>
					<div className="flex-row items-center hidden gap-1 sm:flex">
						<div className="flex-col items-center hidden gap-1 sm:flex">
							<PurchaseDate purchaseDate={purchaseDate} />
							<TotalCost totalCost={item.total_cost} />
						</div>
						{/* {isGifter && giftImages.length > 0 && (
							<div className="flex flex-shrink-0 gap-1">
								{giftImages.slice(0, 2).map(giftImage => (
									<ItemImage key={giftImage.image_id} url={giftImage.images.signed_url} className="w-12 h-12" />
								))}
								{giftImages.length > 2 && (
									<div className="flex items-center justify-center w-12 h-12 text-xs font-bold border rounded-lg bg-muted">
										+{giftImages.length - 2}
									</div>
								)}
							</div>
						)} */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								setTotalCost(item.total_cost?.toString() || '')
								setNotes(item.gifted_notes || '')
								setIsDialogOpen(true)
							}}
							className="shrink-0"
						>
							<EditIcon />
						</Button>
					</div>
				</div>
				{item.gifted_notes && <PurchaseNotes notes={item.gifted_notes} />}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="flex flex-col max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Purchase Details</DialogTitle>
						<DialogDescription>
							Update the cost and notes for this purchase.
							{isGifter && ' You can also upload private receipt images that only you can see.'}
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="total-cost">Total Cost</Label>
							<div className="relative">
								<FontAwesomeIcon icon={faDollarSign} className="absolute w-4 h-4 -translate-y-1/2 top-1/2 left-3 text-muted-foreground" />
								<Input
									id="total-cost"
									type="number"
									className="bg-background pl-9"
									min="0"
									step="0.01"
									placeholder="0.00"
									value={totalCost}
									onChange={e => setTotalCost(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								placeholder="Add any notes about this purchase..."
								value={notes}
								onChange={e => setNotes(e.target.value)}
								rows={3}
							/>
						</div>
						{notes && (
							<div className="flex flex-col w-full gap-1.5">
								<Label htmlFor="notes">Notes Preview</Label>
								<div className="grid ">
									<div className="inline px-3 py-2 text-sm border rounded-md text-foreground/75 border-input bg-background/50">
										<MarkdownBlock>{notes}</MarkdownBlock>
									</div>
								</div>
							</div>
						)}
						{/* {isGifter && (
							<div className="flex flex-col gap-2 pt-4 border-t">
								<div className="flex items-center gap-2">
									<FontAwesomeIcon icon={faReceipt} className="text-muted-foreground" />
									<Label>Receipt Images (Private - Only visible to you)</Label>
								</div>
								<ImageUploader onImageUploaded={handleImageUploaded} sourceType="gift_receipt" />
								{isLoadingImages ? (
									<div className="flex items-center justify-center py-4 text-sm text-muted-foreground">Loading images...</div>
								) : giftImages.length > 0 ? (
									<div className="grid grid-cols-2 gap-2">
										{giftImages.map(giftImage => (
											<div key={giftImage.image_id} className="relative group">
												<ItemImage url={giftImage.images.signed_url} className="w-full h-32" />
												<Button
													variant="destructive"
													size="icon"
													className="absolute transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100"
													onClick={() => handleRemoveImage(giftImage.image_id)}
												>
													<FontAwesomeIcon icon={faTrash} size="xs" />
												</Button>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">No receipt images uploaded yet.</p>
								)}
							</div>
						)} */}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={isLoading}>
							{isLoading ? 'Saving...' : 'Save'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
