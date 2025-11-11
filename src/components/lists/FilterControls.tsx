'use client'

import {
	faSharpSolidBoltCircleArrowDown,
	faSharpSolidBoltCircleArrowUp,
	faSharpSolidCalendarCircleArrowDown,
	faSharpSolidCalendarCircleArrowUp,
} from '@awesome.me/kit-f973af7de0/icons/kit/custom'
import { faSquare } from '@awesome.me/kit-f973af7de0/icons/sharp/regular'
import { faBolt, faDown, faLeftRight, faSort, faSquareCheck, faUp, faXmark } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { faFilters } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ItemPriority } from '@/utils/enums'

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

const commonButtonClasses =
	'rounded-none first:rounded-l last:rounded-r data-[state=on]:bg-primary data-[state=on]:text-primary-foreground [&_svg]:size-5'

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
	const filterByPriority = (priority: string | null) => {
		if (!priority || priority === '') {
			onChange({ ...filters, priorities: [] })
			return
		}

		const newPriorities = filters.priorities.includes(priority) ? [] : [priority]
		onChange({ ...filters, priorities: newPriorities })
	}

	const filterByStatus = (purchased: string | null) => {
		onChange({
			...filters,
			showPurchasedOnly: purchased === 'showPurchasedOnly',
			showUnpurchasedOnly: purchased === 'showUnpurchasedOnly',
		})
	}

	const resetFilters = () => {
		onChange({
			showPurchasedOnly: false,
			showUnpurchasedOnly: false,
			priorities: [],
			sort: 'priority-desc',
		})
	}

	const hasActiveFilters = filters.showPurchasedOnly || filters.showUnpurchasedOnly || filters.priorities.length > 0

	const isValidSortOption = (value: string): value is SortOption => {
		return ['date-asc', 'date-desc', 'priority-asc', 'priority-desc'].includes(value)
	}

	const handleSortChange = (value: string) => {
		if (isValidSortOption(value)) {
			onChange({ ...filters, sort: value })
		}
	}

	return (
		<div className="flex flex-col justify-between gap-2 lg:items-center sm:flex-row">
			<div className="flex flex-row items-center gap-2">
				{/* <FontAwesomeIcon icon={faFilters} size="lg" className="text-muted-foreground" /> */}
				<div>Filter</div>

				{/* PURCHASED / UNPURCHASED */}
				<ToggleGroup
					type="single"
					size={'sm'}
					className="gap-0 border rounded-md w-fit"
					onValueChange={filterByStatus}
					value={filters.showPurchasedOnly ? 'showPurchasedOnly' : filters.showUnpurchasedOnly ? 'showUnpurchasedOnly' : ''}
				>
					<ToggleGroupItem value="showUnpurchasedOnly" className={cn(commonButtonClasses)}>
						<FontAwesomeIcon icon={faSquare} />
					</ToggleGroupItem>
					<ToggleGroupItem value="showPurchasedOnly" className={cn(commonButtonClasses)}>
						<FontAwesomeIcon icon={faSquareCheck} />
					</ToggleGroupItem>
				</ToggleGroup>

				{/* PRIORITY */}
				<ToggleGroup
					type="single"
					size={'sm'}
					className="gap-0 border rounded-md w-fit"
					onValueChange={filterByPriority}
					value={filters.priorities[0] || ''}
				>
					<ToggleGroupItem value={ItemPriority['Very High']} className={cn(commonButtonClasses)}>
						<FontAwesomeIcon icon={faBolt} />
					</ToggleGroupItem>
					<ToggleGroupItem value={ItemPriority.High} className={cn(commonButtonClasses)}>
						<FontAwesomeIcon icon={faUp} />
					</ToggleGroupItem>
					<ToggleGroupItem value={ItemPriority.Normal} className={cn(commonButtonClasses)}>
						<FontAwesomeIcon icon={faLeftRight} />
					</ToggleGroupItem>
					<ToggleGroupItem value={ItemPriority.Low} className={cn(commonButtonClasses)}>
						<FontAwesomeIcon icon={faDown} />
					</ToggleGroupItem>
				</ToggleGroup>

				{hasActiveFilters && (
					<Button variant="destructive" size="icon" onClick={resetFilters}>
						<FontAwesomeIcon icon={faXmark} />
					</Button>
				)}
			</div>

			{/* SORT */}
			<div className="flex flex-row items-center gap-2">
				{/* <FontAwesomeIcon icon={faSort} size="lg" className="text-muted-foreground" /> */}
				<div className="flex flex-row gap-2">Sort</div>
				<Select value={filters.sort} onValueChange={handleSortChange}>
					<SelectTrigger className="w-[200px]">
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
