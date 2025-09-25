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
import { cn } from '@/lib/utils'
import { ItemPriority } from '@/utils/enums'

export type FilterState = {
	showPurchasedOnly: boolean
	showUnpurchasedOnly: boolean
	priorities: string[]
	sort: 'date-asc' | 'date-desc' | 'priority-asc' | 'priority-desc'
}

type Props = {
	filters: FilterState
	onChange: (filters: FilterState) => void
}

const commonButtonClasses =
	'rounded-none first:rounded-l last:rounded-r data-[state=on]:bg-primary data-[state=on]:text-primary-foreground [&_svg]:size-5'

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

	return (
		<div className="flex flex-col justify-between gap-2 lg:items-center lg:flex-row">
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
				<ToggleGroup
					type="single"
					size={'sm'}
					className="gap-0 border rounded-md w-fit"
					onValueChange={(value: string) => {
						if (!value) return
						onChange({ ...filters, sort: value as 'date-asc' | 'date-desc' | 'priority-asc' | 'priority-desc' })
					}}
					value={filters.sort}
				>
					<ToggleGroupItem value="date-desc" className={cn(commonButtonClasses)} aria-label="Sort by date descending">
						<FontAwesomeIcon icon={faSharpSolidCalendarCircleArrowDown} />
					</ToggleGroupItem>
					<ToggleGroupItem value="date-asc" className={cn(commonButtonClasses)} aria-label="Sort by date ascending">
						<FontAwesomeIcon icon={faSharpSolidCalendarCircleArrowUp} />
					</ToggleGroupItem>
					<ToggleGroupItem value="priority-desc" className={cn(commonButtonClasses)} aria-label="Sort by priority descending">
						<FontAwesomeIcon icon={faSharpSolidBoltCircleArrowDown} />
					</ToggleGroupItem>
					<ToggleGroupItem value="priority-asc" className={cn(commonButtonClasses)} aria-label="Sort by priority ascending">
						<FontAwesomeIcon icon={faSharpSolidBoltCircleArrowUp} />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	)
}
