'use client'

import { startTransition, useState } from 'react'
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
import { updatePurchaseDetails } from '@/app/actions/gifts'

import { formatDateBasedOnAge } from '@/utils/date'
import { ItemPriority } from '@/utils/enums'
import Link from 'next/link'
import { EditIcon } from '../icons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'

type Props = {
	item: ListItem & Gift & Purchase
	recipient?: User | null
}

const PurchaseDate = ({ purchaseDate }: { purchaseDate: string | null }) => {
	if (!purchaseDate) return null
	return <Badge variant="secondary">{formatDateBasedOnAge(purchaseDate)}</Badge>
}

const TotalCost = ({ item }: { item: Purchase }) => {
	if (item.total_cost === undefined || item.total_cost === null) return null
	const totalCost = item.total_cost.toFixed(2)
	return (
		<Badge variant="outline" className="text-[10px] bg-green-800">
			${totalCost}
		</Badge>
	)
}

export default function PurchaseRow({ item, recipient }: Props) {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [totalCost, setTotalCost] = useState<string>(item.total_cost?.toString() || '')
	const [notes, setNotes] = useState<string>(item.gifted_notes || '')
	const [isLoading, setIsLoading] = useState(false)

	if (!item) return null

	if (item.gift_id === 578) {
		console.log('PurchaseRow.item', item)
	}

	const purchaseDate = item?.gift_created_at ? new Date(item.gift_created_at).toDateString() : null

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
							<TotalCost item={item} />
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
							<TotalCost item={item} />
						</div>
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
				{item.gifted_notes && (
					<div className="flex items-center gap-1 px-2 py-1 text-sm italic break-words border rounded border-amber-500/25 text-foreground/75">
						<FontAwesomeIcon icon={faNoteSticky} className="text-amber-500" />
						{item.gifted_notes}
					</div>
				)}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="flex flex-col max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Purchase Details</DialogTitle>
						<DialogDescription>Update the cost and notes for this purchase.</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="total-cost">Total Cost</Label>
							<Input
								id="total-cost"
								type="number"
								step="0.01"
								placeholder="0.00"
								value={totalCost}
								onChange={e => setTotalCost(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								placeholder="Add any notes about this purchase..."
								value={notes}
								onChange={e => setNotes(e.target.value)}
								rows={4}
							/>
						</div>
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
