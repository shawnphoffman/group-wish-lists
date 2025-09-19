'use client'

import { faSquare } from '@awesome.me/kit-f973af7de0/icons/sharp/regular'
import {
	faBolt,
	faDirectionLeftRight,
	faDown,
	faLeftRight,
	faSquareCheck,
	faUp,
	faUpDown,
	faXmark,
} from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
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
		})
	}

	const hasActiveFilters = filters.showPurchasedOnly || filters.showUnpurchasedOnly || filters.priorities.length > 0

	return (
		<div className="flex flex-row items-center gap-2">
			<FontAwesomeIcon icon={faFilters} size="lg" />

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
	)
}
