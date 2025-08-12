'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import EmptyMessage from '@/components/common/EmptyMessage'
import {
	// DeleteIcon,
	MoveIcon,
} from '@/components/icons/Icons'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import MoveItemButtonDialog from '@/components/items/components/MoveItemButtonDialog'
import MyListsSelect from '@/components/items/components/MyListsSelect'
import ItemRowSelectable from '@/components/items/ItemRowSelectable'
import { List, ListItem } from '@/components/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type ClientProps = { id: List['id']; items: ListItem[]; list: List }

const SelectList = ({ id, items, list }: ClientProps) => {
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

	const visibleItems = items.filter(item => !item.archived)

	const handleSelect = (itemId: string, selected: boolean) => {
		setSelectedItems(prev => {
			const newSet = new Set(prev)
			if (selected) {
				newSet.add(itemId)
			} else {
				newSet.delete(itemId)
			}
			return newSet
		})
	}

	// const handleDeleteClick = () => {
	// 	console.log('delete', selectedItems)
	// }

	useEffect(() => {
		// Reset selected items if any selected items are not in visible items
		const visibleItemIds = new Set(visibleItems.map(item => item.id))
		const hasInvalidSelection = Array.from(selectedItems).some(id => !visibleItemIds.has(id))
		if (hasInvalidSelection) {
			setSelectedItems(new Set())
		}
	}, [visibleItems, selectedItems])

	return (
		<div className="flex flex-col flex-1 w-full gap-6 px-0 max-md:gap-2">
			{/* Header */}
			<div className="flex flex-col items-center justify-between w-full gap-2 md:gap-2 md:flex-row">
				<div className="relative flex flex-row items-center gap-1">
					<h1 className="z-10 w-fit">{list.name}</h1>
					<div className="text-[60px] sm:text-[80px] opacity-25 absolute left-4 -top-2 sm:-top-5 flex flex-row gap-4 ">
						<ListTypeIcon type={list.type} className="text-[60px] sm:text-[80px]" />
						{/* {isPrivate && <LockIcon fade={false} />} */}
						{/* {isShared && <ShareIcon />} */}
					</div>
				</div>
				<div className="flex flex-row flex-wrap items-center justify-center flex-1 gap-1 md:justify-end shrink-0">
					<Link href={`/lists/${id}/edit`} className={`${buttonVariants({ variant: 'outline', size: 'sm' })} gap-1 group`}>
						Go Back
					</Link>
					<MoveItemButtonDialog listId={id} ids={selectedItems} />
					{/* <MoveItemsButton id={id} selectedItems={selectedItems} /> */}
					{/* <Button
						variant="outline"
						type="button"
						size="sm"
						onClick={handleDeleteClick}
						className={`group ${selectedItems.size === 0 ? 'opacity-50 pointer-events-none' : ''}`}
					>
						Delete ({selectedItems.size})
						<DeleteIcon />
					</Button> */}
				</div>
			</div>
			<div className="flex flex-col w-full gap-2 px-0">
				{/* Desc */}
				{list?.description && <div className="text-sm leading-tight text-muted-foreground">{list.description}</div>}
				{/* WARNING */}
				{<div className="text-sm leading-tight text-destructive">You are currently bulk-editing this list.</div>}
			</div>
			{/* Rows */}
			<div className="flex flex-col">
				{visibleItems?.length === 0 ? (
					<EmptyMessage />
				) : (
					<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
						{visibleItems?.map(item => (
							<ItemRowSelectable key={item.id} item={item} onSelect={selected => handleSelect(item.id, selected)} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

function MoveItemsButton({ id, selectedItems }: { id: List['id']; selectedItems: Set<string> }) {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (selectedItems.size === 0) {
			setOpen(false)
		}
	}, [selectedItems])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className={`gap-1 group ${selectedItems.size === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
					Move ({selectedItems.size})
					<MoveIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Move Items</DialogTitle>
					<DialogDescription>What list would you like to move the {selectedItems.size} items to?</DialogDescription>
				</DialogHeader>
				<MyListsSelect listId={id} ids={selectedItems} />
			</DialogContent>
		</Dialog>
	)
}

export default SelectList
