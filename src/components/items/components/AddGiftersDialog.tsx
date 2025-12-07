'use client'

import { startTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'
import { updateItemAdditionalGifters } from '@/app/actions/gifts'
import { getUsers } from '@/app/actions/users'
import { ListItem } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Props = {
	itemId: ListItem['id']
	open: boolean
	onOpenChange: (open: boolean) => void
	initialGifterIds?: string[]
}

export default function AddGiftersDialog({ itemId, open, onOpenChange, initialGifterIds = [] }: Props) {
	const [users, setUsers] = useState<Array<{ user_id: string; display_name: string }>>([])
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set(initialGifterIds))
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (open) {
			loadUsers()
		}
	}, [open])

	useEffect(() => {
		setSelectedUsers(new Set(initialGifterIds))
	}, [initialGifterIds])

	const loadUsers = async () => {
		try {
			const [usersResponse, currentUserResponse] = await Promise.all([getUsers(), getSessionUser()])

			if (usersResponse.data) {
				const filteredUsers = usersResponse.data
					.filter((user: any) => user.user_id !== currentUserResponse?.id)
					.sort((a: any, b: any) => a.display_name.localeCompare(b.display_name))

				setUsers(filteredUsers)
			}
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

	const handleSaveGifters = async () => {
		setIsLoading(true)
		try {
			await updateItemAdditionalGifters(itemId, Array.from(selectedUsers))
			onOpenChange(false)
			startTransition(() => {
				router.refresh()
			})
		} catch (error) {
			console.error('Failed to update additional gifters:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSaveGifters} disabled={isLoading}>
						{isLoading ? 'Saving...' : 'Save'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
