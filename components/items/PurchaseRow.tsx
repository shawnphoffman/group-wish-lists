import Badge from '@/components/common/Badge'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import { Gift, ListItem, Purchase } from '@/components/types'
import { ItemPriority } from '@/utils/enums'

type Props = {
	item: ListItem & Gift & Purchase
}

export default async function PurchaseRow({ item }: Props) {
	if (!item) return null

	// console.log('PurchaseRow', item)

	return (
		<div className={`list-item`}>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority & Checkbox */}
					<div className="flex flex-col items-center justify-center gap-2 shrink-0">
						{/* Priority */}
						{item.priority !== ItemPriority.Normal && <ItemPriorityIcon priority={item.priority} />}
					</div>
					{/*  */}
					<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div>{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="notes">{item.notes}</div>}

							{/* Recipient */}
							<Badge className="self-start mt-1 xxs" colorId={item.recipient_id}>
								{item.recipient_display_name}
							</Badge>
						</div>

						<div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
							{item?.gift_created_at && <Badge className="gray">{new Date(item.gift_created_at).toDateString()}</Badge>}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
