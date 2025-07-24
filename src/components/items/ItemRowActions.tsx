'use client'

import { Fragment, useEffect, useState, useTransition } from 'react'
import { faEllipsisVertical } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'
import { updateItemAdditionalGifters } from '@/app/actions/gifts'
import { updateItemStatus } from '@/app/actions/items'
import { getUsers } from '@/app/actions/users'
import { ListItem } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
	const [users, setUsers] = useState<Array<{ user_id: string; display_name: string }>>([])
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set(additionalGifterIds))
	const [isLoading, setIsLoading] = useState(false)
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

	const handleAddGiftersClick = async () => {
		try {
			const [usersResponse, currentUserResponse] = await Promise.all([getUsers(), getSessionUser()])

			if (usersResponse.data) {
				const filteredUsers = usersResponse.data
					.filter((user: any) => user.user_id !== currentUserResponse?.id)
					.sort((a: any, b: any) => a.display_name.localeCompare(b.display_name))

				setUsers(filteredUsers)
			}

			setDialogOpen(true)
		} catch (error) {
			console.error('Failed to load users:', error)
		}
	}

	const handleUserToggle = (userId: string, checked: boolean) => {
		setSelectedUsers(prev => {
			const newSet = new Set(prev)
			if (checked) {
				newSet.add(userId)
			} else {
				newSet.delete(userId)
			}
			return newSet
		})
	}

	// Update selected users when additionalGifterIds changes
	// useEffect(() => {
	// 	setSelectedUsers(new Set(additionalGifterIds))
	// }, [additionalGifterIds])

	const handleSaveGifters = async () => {
		setIsLoading(true)
		try {
			await updateItemAdditionalGifters(itemId, Array.from(selectedUsers))
			setDialogOpen(false)
			router.refresh()
		} catch (error) {
			console.error('Failed to update additional gifters:', error)
		} finally {
			setIsLoading(false)
		}
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

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="flex flex-col max-w-md max-h-dvh">
					<DialogHeader>
						<DialogTitle>Add More Gifters</DialogTitle>
						<DialogDescription>Select additional people who are helping to gift this item.</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-2 overflow-y-auto">
						{users.map(user => (
							<div key={user.user_id} className="flex items-center gap-2">
								<Checkbox
									id={user.user_id}
									checked={selectedUsers.has(user.user_id)}
									onCheckedChange={checked => handleUserToggle(user.user_id, checked as boolean)}
								/>
								<label htmlFor={user.user_id} className="text-sm cursor-pointer">
									{user.display_name}
								</label>
							</div>
						))}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveGifters} disabled={isLoading}>
							{isLoading ? 'Saving...' : 'Save'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Fragment>
	)
}
