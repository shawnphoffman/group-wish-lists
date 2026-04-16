'use client'

import { useCallback, useState, useTransition } from 'react'
import { faSpinnerScale } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createGift, deleteGift, updateGiftQuantity } from '@/app/actions/gifts'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Props = {
	type: 'add' | 'delete' | 'edit'
	children: React.ReactNode
	id: string
	quantity: number
	otherQty: number
	selfQty: number
}

// const commonSizes = 'w-10 h-8 sm:h-6 flex flex-row items-center justify-center'
const commonSizes = 'w-10 h-8 flex flex-row items-center justify-center'
const commonIconSizes = 'text-3xl sm:text-2xl'

export default function ItemRowCheckbox({ type, children, id, otherQty, selfQty, quantity: requestedQty }: Props) {
	const [isPending, startTransition] = useTransition()
	const [dialogOpen, setDialogOpen] = useState(false)
	const [quantity, setQuantity] = useState(selfQty || requestedQty)
	const [isUpdating, startUpdateTransition] = useTransition()
	const router = useRouter()
	const { toast } = useToast()

	const handleClick = useCallback(() => {
		// Guards a second synchronous click while the transition is in flight.
		if (isPending) return

		if (type === 'edit') {
			setDialogOpen(true)
			return
		}

		startTransition(async () => {
			if (type === 'add') {
				const result = await createGift(id, quantity)
				if (result.status === 'already_claimed') {
					toast({
						title: 'Someone beat you to it',
						description: 'This item was just claimed. Refreshing…',
						variant: 'destructive',
					})
					router.refresh()
				} else if (result.status === 'error') {
					toast({ title: 'Could not claim item', description: result.error, variant: 'destructive' })
					router.refresh()
				} else if (result.status === 'unauthenticated') {
					toast({ title: 'Please sign in to claim items', variant: 'destructive' })
				}
			} else if (type === 'delete') {
				const result = await deleteGift(id)
				if (result.status === 'error') {
					toast({ title: 'Could not remove claim', description: result.error, variant: 'destructive' })
					router.refresh()
				}
			}
		})
	}, [id, isPending, quantity, router, toast, type])

	const handleUpdateQuantity = useCallback(() => {
		startUpdateTransition(async () => {
			const result = quantity === 0 ? await deleteGift(id) : await updateGiftQuantity(id, quantity)
			if (result.status === 'error') {
				toast({ title: 'Could not update quantity', description: result.error, variant: 'destructive' })
				return
			}
			setDialogOpen(false)
		})
	}, [id, quantity, toast])

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
							<Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isUpdating}>
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
		<button onClick={handleClick} disabled={isPending} className={cn('cursor-pointer', commonSizes)}>
			{children}
		</button>
	)
}
