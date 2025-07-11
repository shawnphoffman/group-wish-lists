'use client'

import { useTransition } from 'react'
import { faEllipsisVertical } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { updateItemStatus } from '@/app/actions/items'
import { ListItem } from '@/components/types'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ItemStatus, ItemStatusType } from '@/utils/enums'

type Props = {
	itemId: ListItem['id']
	status: ItemStatusType
}

export default function ItemRowActions({ itemId, status }: Props) {
	const [isPending, startTransition] = useTransition()
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

	return (
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
					{status === ItemStatus.Unavailable ? (
						<DropdownMenuItem onClick={handleMarkAsAvailable}>Mark as available</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={handleMarkAsUnavailable}>Mark as unavailable</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
