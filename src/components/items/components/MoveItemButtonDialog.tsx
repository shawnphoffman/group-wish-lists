'use client'

import { startTransition, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { moveItem, moveItems } from '@/app/actions/items'
import { clearListsCache } from '@/app/actions/lists'
import { LoadingIcon, LockIcon, MoveIcon } from '@/components/icons/Icons'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import type { List, ListItem, ListSharedWithMe } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
// import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCachedLists } from '@/hooks/useCachedLists'

type Props = { listId: List['id']; id?: ListItem['id']; ids?: Set<ListItem['id']> }

export default function MoveItemButtonDialog({ id, listId, ids }: Props) {
	const [open, setOpen] = useState(false)

	const { lists, loading } = useCachedLists()
	const [list, setList] = useState<List | null>(null)
	const router = useRouter()

	let myPublicLists: List[] = []
	let myPrivateLists: List[] = []
	let sharedWithMeLists: List[] = []

	lists.forEach(l => {
		if ((l as ListSharedWithMe).sharer_id) {
			sharedWithMeLists.push(l)
		} else if (l.private) {
			myPrivateLists.push(l)
		} else {
			myPublicLists.push(l)
		}
	})

	myPrivateLists.sort((a, b) => {
		const typeCompare = a.type.localeCompare(b.type)
		if (typeCompare !== 0) return typeCompare
		return a.name.localeCompare(b.name)
	})

	sharedWithMeLists.sort((a, b) => {
		const typeCompare = a.type.localeCompare(b.type)
		if (typeCompare !== 0) return typeCompare
		return a.name.localeCompare(b.name)
	})

	// Set the current list when lists are loaded
	useEffect(() => {
		if (lists.length > 0) {
			const currentList = lists.find((list: List) => list.id === Number(listId))
			setList(currentList || null)
		}
	}, [lists, listId])

	const handleChangeList = useCallback(
		value => {
			setList(lists.find(l => l.id === Number(value)) || null)
		},
		[lists]
	)

	const handleMoveItem = useCallback(async () => {
		if (!list || (!id && !ids?.size)) return
		let resp: { status: string; items?: any } | null = null
		if (ids?.size) {
			resp = await moveItems(Array.from(ids), list?.id)
		} else {
			resp = await moveItem(id!, list?.id)
		}
		if (resp.status === 'success') {
			// Clear cache to ensure fresh data after moving items
			clearListsCache()
			startTransition(() => {
				router.refresh()
				setOpen(false)
			})
		}
	}, [id, ids, list, router])

	// if (loading) {
	// 	return <LoadingIcon className="!border-0" />
	// }

	// if (!lists || !list) {
	// 	return null
	// }

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" type="button" size="sm" disabled={ids?.size === 0 && !id}>
					Move {ids?.size ? `(${ids?.size})` : ''}
					<MoveIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Move Item</DialogTitle>
					<DialogDescription>What list would you like to move this item to?</DialogDescription>
				</DialogHeader>
				<fieldset className="flex flex-col items-center gap-2 sm:flex-row !leading-none" disabled={loading || ids?.size === 0}>
					<div className="grid w-full gap-1.5">
						{loading || !list ? (
							<LoadingIcon className="!border-0" />
						) : (
							<Select name="list" value={list.id.toString()} onValueChange={handleChangeList}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{/* MY PUBLIC LISTS */}
									{myPublicLists.length > 0 && (
										<SelectGroup>
											<SelectLabel>My Public Lists</SelectLabel>
											{myPublicLists.map((list: List) => (
												<SelectItem key={list.id} value={`${list.id}`}>
													<div className="flex flex-row items-center gap-1 text-base">
														<ListTypeIcon type={list.type} className="text-sm" />
														{list.name}
														{list.private && <> 🔒</>}
														{list.primary && <> ⭐</>}
													</div>
												</SelectItem>
											))}
										</SelectGroup>
									)}
									{/* MY PRIVATE LISTS */}
									{myPrivateLists.length > 0 && (
										<SelectGroup>
											<SelectLabel>My Private Lists</SelectLabel>
											{myPrivateLists.map((list: List) => (
												<SelectItem key={list.id} value={`${list.id}`}>
													<div className="flex flex-row items-center gap-1 text-base">
														<ListTypeIcon type={list.type} className="text-sm" />
														{list.name}
														{list.private && <> 🔒</>}
														{list.primary && <> ⭐</>}
													</div>
												</SelectItem>
											))}
										</SelectGroup>
									)}
									{/* SHARED WITH ME */}
									{sharedWithMeLists.length > 0 && (
										<SelectGroup>
											<SelectLabel>Lists I Can Edit</SelectLabel>
											{sharedWithMeLists.map((list: List) => (
												<SelectItem key={list.id} value={`${list.id}`}>
													<div className="flex flex-row items-center gap-1 text-base">
														<ListTypeIcon type={list.type} className="text-sm" />
														{list.name}
														{list.private && <> 🔒</>}
														{(list as ListSharedWithMe).sharer_display_name && (
															<Badge variant="destructive" className="!text-[10px] whitespace-nowrap gap-1 px-1.5 py-0.25">
																{/* <FontAwesomeIcon icon={faLockKeyhole} size="sm" />  */}
																{(list as ListSharedWithMe).sharer_display_name}
															</Badge>
														)}
													</div>
												</SelectItem>
											))}
										</SelectGroup>
									)}
								</SelectContent>
							</Select>
						)}
					</div>
				</fieldset>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button disabled={listId === list?.id} onClick={handleMoveItem}>
						Move Item
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
