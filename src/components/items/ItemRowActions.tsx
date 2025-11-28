'use client'

import { Fragment, useState, useTransition } from 'react'
import { faEllipsisVertical } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { updateItemStatus } from '@/app/actions/items'
import { ListItem } from '@/components/types'
import { Button } from '@/components/ui/button'
import AddGiftersDialog from '@/components/items/components/AddGiftersDialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ItemStatus, ItemStatusType } from '@/utils/enums'
import { isDeployed } from '@/utils/environment'

type Props = {
	itemId: ListItem['id']
	status: ItemStatusType
	additionalGifterIds?: string[]
}

export default function ItemRowActions({ itemId, status, additionalGifterIds = [] }: Props) {
	const [isPending, startTransition] = useTransition()
	const [dialogOpen, setDialogOpen] = useState(false)
	const router = useRouter()

	const handleMarkAsAvailable = () => {
		startTransition(async () => {
			await updateItemStatus(itemId, ItemStatus.Incomplete)
			router.refresh()
		})
	}

	const handleMarkAsUnavailable = () => {
		startTransition(async () => {
			await updateItemStatus(itemId, ItemStatus.Unavailable)
			router.refresh()
		})
	}

	const handleAddGiftersClick = () => {
		setDialogOpen(true)
	}

	return (
		<Fragment>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" type="button" size="icon" className="group">
						<FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="start">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href={`/clone/${itemId}`}>Copy to your own list</Link>
						</DropdownMenuItem>
						{status === ItemStatus.Unavailable && <DropdownMenuItem onClick={handleMarkAsAvailable}>Mark as available</DropdownMenuItem>}
						{status !== ItemStatus.Unavailable && status !== ItemStatus.Complete && (
							<DropdownMenuItem onClick={handleMarkAsUnavailable}>Mark as unavailable</DropdownMenuItem>
						)}
						{status === ItemStatus.Complete && <DropdownMenuItem onClick={handleAddGiftersClick}>Add more gifters</DropdownMenuItem>}
					</DropdownMenuGroup>
					{!isDeployed && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem disabled>Row ID: {itemId}</DropdownMenuItem>
							</DropdownMenuGroup>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AddGiftersDialog itemId={itemId} open={dialogOpen} onOpenChange={setDialogOpen} initialGifterIds={additionalGifterIds} />
		</Fragment>
	)
}
