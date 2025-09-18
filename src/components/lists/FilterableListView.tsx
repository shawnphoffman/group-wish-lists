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
		showCompleted: true,
		showUnavailable: true,
		priorities: []
	})

	const filteredItems = useMemo(() => {
		return visibleItems.filter(item => {
			if (!filters.showCompleted && item.status === ItemStatus.Complete) {
				return false
			}

			if (!filters.showUnavailable && item.status === ItemStatus.Unavailable) {
				return false
			}

			if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) {
				return false
			}

			return true
		})
	}, [visibleItems, filters])

	return (
		<div className="flex flex-col gap-6">
			<FilterControls
				filters={filters}
				onChange={setFilters}
				totalCount={visibleItems.length}
				filteredCount={filteredItems.length}
			/>

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