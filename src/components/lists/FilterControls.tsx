'use client'

import { faXmark, faSort, faFilter } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type SortOption = 'date-asc' | 'date-desc' | 'priority-asc' | 'priority-desc'

export type FilterState = {
	showPurchasedOnly: boolean
	showUnpurchasedOnly: boolean
	priorities: string[]
	sort: SortOption
}

type Props = {
	filters: FilterState
	onChange: (filters: FilterState) => void
}

type FilterOption = 'showUnpurchasedOnly' | 'showPurchasedOnly' | ''

const getFilterLabel = (filters: FilterState): string => {
	if (filters.showPurchasedOnly) return 'Purchased Only'
	if (filters.showUnpurchasedOnly) return 'Unpurchased Only'
	return 'All Items'
}

const getSortLabel = (sort: FilterState['sort']): string => {
	switch (sort) {
		case 'date-desc':
			return 'Date (Newest First)'
		case 'date-asc':
			return 'Date (Oldest First)'
		case 'priority-desc':
			return 'Priority (High to Low)'
		case 'priority-asc':
			return 'Priority (Low to High)'
		default:
			return 'Select sort order'
	}
}

export default function FilterControls({ filters, onChange }: Props) {
	const getCurrentFilterValue = (): FilterOption => {
		if (filters.showPurchasedOnly) return 'showPurchasedOnly'
		if (filters.showUnpurchasedOnly) return 'showUnpurchasedOnly'
		return ''
	}

	const handleFilterChange = (value: string) => {
		if (value === 'showPurchasedOnly') {
			onChange({
				...filters,
				showPurchasedOnly: true,
				showUnpurchasedOnly: false,
			})
		} else if (value === 'showUnpurchasedOnly') {
			onChange({
				...filters,
				showPurchasedOnly: false,
				showUnpurchasedOnly: true,
			})
		} else {
			onChange({
				...filters,
				showPurchasedOnly: false,
				showUnpurchasedOnly: false,
			})
		}
	}

	const resetFilters = () => {
		onChange({
			showPurchasedOnly: false,
			showUnpurchasedOnly: false,
			priorities: [],
			sort: 'priority-desc',
		})
	}

	const hasActiveFilters = filters.showPurchasedOnly || filters.showUnpurchasedOnly

	const isValidSortOption = (value: string): value is SortOption => {
		return ['date-asc', 'date-desc', 'priority-asc', 'priority-desc'].includes(value)
	}

	const handleSortChange = (value: string) => {
		if (isValidSortOption(value)) {
			onChange({ ...filters, sort: value })
		}
	}

	return (
		<div className="flex flex-row justify-between gap-2 lg:items-center">
			<div className="flex flex-row items-center flex-1 gap-2">
				<div className="hidden sm:flex">Filter</div>
				<div className="flex sm:hidden">
					<FontAwesomeIcon icon={faFilter} />
				</div>
				<Select value={getCurrentFilterValue()} onValueChange={handleFilterChange}>
					<SelectTrigger className="sm:w-[200px]">
						<SelectValue placeholder="All Items">{getFilterLabel(filters)}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="showAll">All Items</SelectItem>
						<SelectItem value="showUnpurchasedOnly">Unpurchased Only</SelectItem>
						<SelectItem value="showPurchasedOnly">Purchased Only</SelectItem>
					</SelectContent>
				</Select>

				{hasActiveFilters && (
					<Button variant="destructive" size="icon" onClick={resetFilters}>
						<FontAwesomeIcon icon={faXmark} />
					</Button>
				)}
			</div>

			{/* SORT */}
			<div className="flex flex-row items-center justify-end flex-1 gap-2">
				<div className="hidden sm:flex">Sort</div>
				<div className="flex sm:hidden">
					<FontAwesomeIcon icon={faSort} />
				</div>
				<Select value={filters.sort} onValueChange={handleSortChange}>
					<SelectTrigger className="sm:w-[200px]">
						<SelectValue placeholder="Select sort order">{getSortLabel(filters.sort)}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="date-desc">Date (Newest First)</SelectItem>
						<SelectItem value="date-asc">Date (Oldest First)</SelectItem>
						<SelectItem value="priority-desc">Priority (High to Low)</SelectItem>
						<SelectItem value="priority-asc">Priority (Low to High)</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
