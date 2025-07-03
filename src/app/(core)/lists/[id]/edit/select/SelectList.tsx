'use client'

import { useState } from 'react'
import Link from 'next/link'

import EmptyMessage from '@/components/common/EmptyMessage'
import {
	DeleteIcon,
	// , MoveIcon
} from '@/components/icons/Icons'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import ItemRowSelectable from '@/components/items/ItemRowSelectable'
import { List, ListItem } from '@/components/types'
import { Button, buttonVariants } from '@/components/ui/button'

type ClientProps = {
	id: List['id']
	items: ListItem[]
	list: List
}

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

	const handleDeleteClick = () => {
		console.log('delete', selectedItems)
	}

	return (
		<div className="flex flex-col flex-1 w-full gap-6 px-0 max-md:gap-2 animate-page-in">
			{/* Header */}
			<div className="flex flex-col items-center justify-between gap-2 md:gap-2 md:flex-row">
				<div className="flex flex-row items-center flex-1 w-full gap-2 flex-nowrap">
					<h1 className="w-fit">{list.name}</h1>
					<ListTypeIcon type={list.type} className="text-[80px] opacity-25 absolute left-4 -top-5 -z-10" />
				</div>
				<div className="flex flex-row flex-wrap items-center justify-center flex-1 gap-1 md:justify-end shrink-0">
					<Link href={`/lists/${id}/edit`} className={`${buttonVariants({ variant: 'outline', size: 'sm' })} gap-1 group`}>
						Go Back
					</Link>
					{/* <Link
						href={`/lists/${id}/edit/move?items=${Array.from(selectedItems).join(',')}`}
						className={`${buttonVariants({ variant: 'outline', size: 'sm' })} gap-1 group ${selectedItems.size === 0 ? 'opacity-50 pointer-events-none' : ''}`}
					>
						Move ({selectedItems.size})
						<MoveIcon />
					</Link> */}
					<Button
						variant="outline"
						type="button"
						size="sm"
						onClick={handleDeleteClick}
						className={`group ${selectedItems.size === 0 ? 'opacity-50 pointer-events-none' : ''}`}
					>
						Delete ({selectedItems.size})
						<DeleteIcon />
					</Button>
				</div>
			</div>

			{/* Desc */}
			{list?.description && <div className="text-sm leading-tight text-muted-foreground">{list.description}</div>}

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

export default SelectList
