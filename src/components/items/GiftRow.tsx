import { format, formatRelative, isBefore, subMonths } from 'date-fns'

import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import { ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'

type Props = {
	item: ListItem & any
	// item: any
}

function formatDateBasedOnAge(date) {
	const sixMonthsAgo = subMonths(new Date(), 6)

	if (isBefore(date, sixMonthsAgo)) {
		// If the date is older than 6 months, return relative format
		return formatRelative(date, new Date())
	} else {
		// Otherwise, return the month and day format
		return format(date, 'MMMM d')
	}
}

export default async function GiftRow({ item }: Props) {
	if (!item) return null

	// console.log('PurchaseRow', item)

	const giftedDate = item?.gifted_items ? formatDateBasedOnAge(new Date(item.gifted_items[0]?.giftedAt)) : null

	return (
		<div className="flex flex-col w-full gap-2 p-3 hover:bg-muted">
			<div className="flex flex-row items-stretch gap-x-3.5">
				{/* Priority & Checkbox */}
				<div className="flex flex-col items-center justify-center gap-2 shrink-0">
					{/* Priority */}
					<ItemPriorityIcon priority={item.priority} />
				</div>
				{/*  */}
				<div className="flex flex-row items-center flex-1 gap-2 md:gap-2">
					{/* Title + Notes */}
					<div className="flex flex-col flex-1">
						{/* Title */}
						<div>{item.title}</div>
						{/* Notes */}
						{item.notes && <div className="notes">{item.notes}</div>}
					</div>

					<div className="flex flex-col items-center justify-center gap-1 md:flex-row">
						{/* Recipient */}
						<Badge variant="outline">{item.display_name}</Badge>
						{/* Gifted Date */}
						{giftedDate && <Badge variant="secondary">{giftedDate}</Badge>}
					</div>
				</div>
			</div>
		</div>
	)
}
