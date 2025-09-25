'use client'

import { useMemo, useState } from 'react'

import EmptyMessage from '@/components/common/EmptyMessage'
import { ListItem, Recipient, User } from '@/components/types'
import { ItemStatus } from '@/utils/enums'

import FilterControls, { FilterState } from './FilterControls'
import ItemRowSSR from './ItemRowSSR'

type Props = {
	items: ListItem[]
	recipient: Recipient
	isOwner: boolean
	currentUser: any
	users: User[]
}

export default function FilterableListView({ items, recipient, isOwner, currentUser, users }: Props) {
	const visibleItems = items.filter(item => !item.archived)

	const [filters, setFilters] = useState<FilterState>({
		showPurchasedOnly: false,
		showUnpurchasedOnly: false,
		priorities: [],
		sort: 'priority-desc',
	})

	const filteredItems = useMemo(() => {
		const result = visibleItems.filter(item => {
			if (filters.showPurchasedOnly && !(item.status === ItemStatus.Complete || item.status === ItemStatus.Partial)) {
				return false
			}

			if (filters.showUnpurchasedOnly && !(item.status === ItemStatus.Unavailable || item.status === ItemStatus.Incomplete)) {
				return false
			}

			if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) {
				return false
			}

			return true
		})

		return result.sort((a, b) => {
			const [sortBy, sortOrder] = filters.sort.split('-') as [string, 'asc' | 'desc']

			if (sortBy === 'date') {
				const aTime = new Date(a.created_at).getTime()
				const bTime = new Date(b.created_at).getTime()
				return sortOrder === 'asc' ? aTime - bTime : bTime - aTime
			} else {
				// Priority sorting: Very High > High > Normal > Low
				const priorityOrder = { veryhigh: 4, high: 3, normal: 2, low: 1 }
				const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
				const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
				return sortOrder === 'asc' ? aPriority - bPriority : bPriority - aPriority
			}
		})
	}, [visibleItems, filters])

	return (
		<div className="flex flex-col gap-3">
			<FilterControls filters={filters} onChange={setFilters} />

			<div className="flex flex-col">
				{filteredItems.length === 0 ? (
					<EmptyMessage />
				) : (
					<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
						{filteredItems.map(item => (
							<ItemRowSSR key={item.id} item={item} isOwnerView={isOwner} currentUser={currentUser} users={users} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
