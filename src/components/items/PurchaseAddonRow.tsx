'use client'

import { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Gift, PurchaseAddon, Purchase } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/components/types'
import { updatePurchaseAddonDetails } from '@/app/actions/gifts'

import Link from 'next/link'
import { EditIcon } from '../icons/Icons'
import { PurchaseDate, PurchaseNotes, TotalCost } from './PurchaseRow'
import MarkdownBlock from './components/MarkdownBlock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'

type Props = {
	item: PurchaseAddon & Gift & Purchase & PurchaseAddon & { type: 'addon' }
	recipient?: User | null
}

export default function PurchaseAddonRow({ item, recipient }: Props) {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [totalCost, setTotalCost] = useState<string>(item.total_cost?.toString() || '')
	const [notes, setNotes] = useState<string>(item.notes || '')
	const [isLoading, setIsLoading] = useState(false)

	if (!item) return null

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

			await updatePurchaseAddonDetails(item.id, costValue, notesValue)
			setIsDialogOpen(false)
			startTransition(() => {
				router.refresh()
			})
		} catch (error) {
			console.error('Failed to update purchase addon details:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<div className="flex flex-col w-full gap-2 p-3 hover:bg-muted" id={`addon-${item.gift_id}`}>
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
						<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
							{/* Title + Notes */}
							<div className="flex flex-col flex-1">
								<Link
									href={`/lists/${item.list_id}#addons`}
									target="_blank"
									className={`flex flex-col gap-0.5 overflow-hidden hover:underline`}
								>
									{item.description}
								</Link>
							</div>

							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									setTotalCost(item.total_cost?.toString() || '')
									setNotes(item.notes || '')
									setIsDialogOpen(true)
								}}
								className="sm:hidden shrink-0"
							>
								<EditIcon />
							</Button>
						</div>
						<Badge variant="outline" className="self-center bg-yellow-700">
							Addon
						</Badge>
					</div>
					<div className="flex-row items-center hidden gap-1 sm:flex">
						<div className="flex-col items-center hidden gap-1 sm:flex">
							<PurchaseDate purchaseDate={purchaseDate} />
							<TotalCost totalCost={item.total_cost} />
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								setTotalCost(item.total_cost?.toString() || '')
								setNotes(item.notes || '')
								setIsDialogOpen(true)
							}}
							className="shrink-0"
						>
							<EditIcon />
						</Button>
					</div>
				</div>
				{item.notes && <PurchaseNotes notes={item.notes} />}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="flex flex-col max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Purchase Addon Details</DialogTitle>
						<DialogDescription>Update the cost and notes for this purchase addon.</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-4">
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
								placeholder="Add any notes about this purchase addon..."
								value={notes}
								onChange={e => setNotes(e.target.value)}
								rows={4}
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
