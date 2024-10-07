import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import { Gift, ListItem, Purchase } from '@/components/types'
import { Badge } from '@/components/ui/badge'

type Props = {
	item: ListItem & Gift & Purchase
}

export default async function PurchaseRow({ item }: Props) {
	if (!item) return null

	// console.log('PurchaseRow', item)

	const purchaseDate = item?.gift_created_at ? new Date(item.gift_created_at).toDateString() : null

	return (
		<div className="flex flex-col w-full gap-2 p-3 hover:bg-muted">
			<div className="flex flex-row items-stretch gap-x-3.5">
				{/* Priority & Checkbox */}
				<div className="flex flex-col items-center justify-center gap-2 shrink-0">
					{/* Priority */}
					<ItemPriorityIcon priority={item.priority} />
				</div>
				{/*  */}
				<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
					{/* Title + Notes */}
					<div className="flex flex-col flex-1">
						{/* Title */}
						<div>{item.title}</div>
						{/* Notes */}
						{item.notes && <div className="notes">{item.notes}</div>}
					</div>

					<div className="flex flex-col items-center justify-center gap-1">
						{/* Purchase Date */}
						{purchaseDate && <Badge variant="secondary">{purchaseDate}</Badge>}
						{/* Recipient */}
						<Badge variant="outline">{item.recipient_display_name}</Badge>
					</div>
				</div>
			</div>
		</div>
	)
}
