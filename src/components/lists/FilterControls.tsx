'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ItemPriority, ItemStatus } from '@/utils/enums'

export type FilterState = {
	showCompleted: boolean
	showUnavailable: boolean
	priorities: string[]
}

type Props = {
	filters: FilterState
	onChange: (filters: FilterState) => void
	totalCount: number
	filteredCount: number
}

export default function FilterControls({ filters, onChange, totalCount, filteredCount }: Props) {
	const priorityOptions = [
		{ value: ItemPriority['Very High'], label: 'Very High' },
		{ value: ItemPriority.High, label: 'High' },
		{ value: ItemPriority.Normal, label: 'Normal' },
		{ value: ItemPriority.Low, label: 'Low' },
	]

	const togglePriority = (priority: string) => {
		const newPriorities = filters.priorities.includes(priority)
			? filters.priorities.filter(p => p !== priority)
			: [...filters.priorities, priority]

		onChange({ ...filters, priorities: newPriorities })
	}

	const resetFilters = () => {
		onChange({
			showCompleted: true,
			showUnavailable: true,
			priorities: []
		})
	}

	const hasActiveFilters = !filters.showCompleted || !filters.showUnavailable || filters.priorities.length > 0

	return (
		<div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
			<div className="flex items-center justify-between">
				<h3 className="font-medium">Filters</h3>
				<div className="flex items-center gap-2">
					{filteredCount !== totalCount && (
						<span className="text-sm text-muted-foreground">
							Showing {filteredCount} of {totalCount} items
						</span>
					)}
					{hasActiveFilters && (
						<Button variant="outline" size="sm" onClick={resetFilters}>
							Clear All
						</Button>
					)}
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				<Button
					variant={filters.showCompleted ? "default" : "outline"}
					size="sm"
					onClick={() => onChange({ ...filters, showCompleted: !filters.showCompleted })}
				>
					{filters.showCompleted ? "Hide" : "Show"} Purchased
				</Button>

				<Button
					variant={filters.showUnavailable ? "default" : "outline"}
					size="sm"
					onClick={() => onChange({ ...filters, showUnavailable: !filters.showUnavailable })}
				>
					{filters.showUnavailable ? "Hide" : "Show"} Unavailable
				</Button>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium">Priority:</span>
				<div className="flex flex-wrap gap-2">
					{priorityOptions.map(({ value, label }) => (
						<Badge
							key={value}
							variant={filters.priorities.includes(value) ? "default" : "outline"}
							className="cursor-pointer hover:bg-accent"
							onClick={() => togglePriority(value)}
						>
							{label}
						</Badge>
					))}
				</div>
			</div>
		</div>
	)
}