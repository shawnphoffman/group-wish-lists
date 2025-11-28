'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import EmptyMessage from '@/components/common/EmptyMessage'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import MoveItemButtonDialog from '@/components/items/components/MoveItemButtonDialog'
import ItemRowSelectable from '@/components/items/ItemRowSelectable'
import { List, ListItem } from '@/components/types'
import { Button, buttonVariants } from '@/components/ui/button'

type ClientProps = { id: List['id']; items: ListItem[]; list: List }

const SelectList = ({ id, items, list }: ClientProps) => {
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

	const visibleItems = useMemo(() => items.filter(item => !item.archived), [items])

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

	const handleSelectAll = () => {
		const allSelected = visibleItems.length > 0 && visibleItems.every(item => selectedItems.has(item.id))
		if (allSelected) {
			// Deselect all
			setSelectedItems(new Set())
		} else {
			// Select all
			setSelectedItems(new Set(visibleItems.map(item => item.id)))
		}
	}

	const allSelected = visibleItems.length > 0 && visibleItems.every(item => selectedItems.has(item.id))

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
					<Button onClick={handleSelectAll} variant="outline" size="sm">
						{allSelected ? 'Deselect All' : 'Select All'}
					</Button>
					<Link href={`/lists/${id}/edit`} className={`${buttonVariants({ variant: 'outline', size: 'sm' })} gap-1 group`}>
						Go Back
					</Link>
					<MoveItemButtonDialog listId={id} ids={selectedItems} />
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
							<ItemRowSelectable
								key={item.id}
								item={item}
								selected={selectedItems.has(item.id)}
								onSelect={selected => handleSelect(item.id, selected)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default SelectList
