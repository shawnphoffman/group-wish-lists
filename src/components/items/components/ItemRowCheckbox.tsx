'use client'

import { useCallback, useState } from 'react'
import { faSpinnerScale } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createGift, deleteGift, updateGiftQuantity } from '@/app/actions/gifts'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Props = {
	type: 'add' | 'delete' | 'edit'
	children: React.ReactNode
	id: string
	quantity: number
	otherQty: number
	selfQty: number
}

const commonSizes = 'w-10 h-8 sm:h-6 flex flex-row items-center justify-center'
const commonIconSizes = 'text-3xl sm:text-2xl'

export default function ItemRowCheckbox({ type, children, id, otherQty, selfQty, quantity: requestedQty }: Props) {
	const [isPending, setIsPending] = useState(false)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [quantity, setQuantity] = useState(selfQty || requestedQty)
	const [isUpdating, setIsUpdating] = useState(false)
	const router = useRouter()

	const handleClick = useCallback(async () => {
		if (type === 'edit') {
			setDialogOpen(true)
			return
		}

		setIsPending(true)

		if (type === 'add') {
			await createGift(id)
		} else if (type === 'delete') {
			await deleteGift(id)
		}

		setIsPending(false)
		router.refresh()
	}, [id, router, type])

	const handleUpdateQuantity = useCallback(async () => {
		setIsUpdating(true)
		try {
			if (quantity === 0) {
				await deleteGift(id)
			} else {
				await updateGiftQuantity(id, quantity)
			}
			setDialogOpen(false)
			router.refresh()
		} catch (error) {
			console.error('Failed to update quantity:', error)
		} finally {
			setIsUpdating(false)
		}
	}, [id, quantity, router])

	if (isPending) {
		return (
			<div className={cn('', commonSizes)}>
				<FontAwesomeIcon icon={faSpinnerScale} spinPulse className={cn('text-yellow-500', commonIconSizes)} />
			</div>
		)
	}

	if (type === 'edit') {
		return (
			<>
				<button onClick={handleClick} className={cn('cursor-pointer', commonSizes)}>
					{children}
				</button>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent className="sm:max-w-sm">
						<DialogHeader>
							<DialogTitle>Edit Quantity</DialogTitle>
							<DialogDescription>How many of this item are you gifting?</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col gap-4 py-4">
							<div className="grid w-full gap-1.5">
								<Label htmlFor="quantity">Quantity</Label>
								<Input
									id="quantity"
									type="number"
									min="0"
									max={requestedQty - otherQty}
									step="1"
									value={quantity}
									onChange={e => setQuantity(parseInt(e.target.value))}
									autoFocus
								/>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleUpdateQuantity} disabled={isUpdating}>
								{isUpdating ? 'Updating...' : 'Update'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		)
	}

	return (
		<button onClick={handleClick} className={cn('cursor-pointer', commonSizes)}>
			{children}
		</button>
	)
}
