import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import { Gift, ListItem, Purchase } from '@/components/types'
import { Badge } from '@/components/ui/badge'

import MarkdownBlock from './components/MarkdownBlock'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from '@/components/types'

import { formatDateBasedOnAge } from '@/utils/date'
import { ItemPriority } from '@/utils/enums'
import Link from 'next/link'

type Props = {
	item: ListItem & Gift & Purchase
	recipient?: User | null
}

const PurchaseDate = ({ purchaseDate }: { purchaseDate: string | null }) => {
	if (!purchaseDate) return null
	return <Badge variant="secondary">{formatDateBasedOnAge(purchaseDate)}</Badge>
}

const TotalCost = ({ item }: { item: Purchase }) => {
	if (item.total_cost === undefined || item.total_cost === null) return null
	const totalCost = item.total_cost.toFixed(2)
	return (
		<Badge variant="outline" className="bg-green-800 ">
			${Number(totalCost).toLocaleString()}
		</Badge>
	)
}

export default function PurchaseRow({ item, recipient }: Props) {
	if (!item) return null

	if (item.gift_id === 578) {
		console.log('PurchaseRow.item', item)
	}

	const purchaseDate = item?.gift_created_at ? new Date(item.gift_created_at).toDateString() : null

	return (
		<div className="flex flex-col w-full gap-2 p-3 sm:flex-row hover:bg-muted" id={`gift-${item.gift_id}`}>
			{/* Recipient */}
			<div className="flex flex-row items-center justify-between gap-1">
				<div className="flex flex-row items-center gap-1">
					{recipient && (
						<Badge variant="outline" className="gap-1 py-0 ps-0 pe-2">
							<Avatar className="border w-7 h-7">
								<AvatarImage src={recipient.image} />
								<AvatarFallback className="text-xl font-bold bg-background text-foreground">
									{recipient.display_name?.charAt(0)}
								</AvatarFallback>
							</Avatar>
							{item.recipient_display_name}
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-1 sm:hidden">
					<TotalCost item={item} />
					<PurchaseDate purchaseDate={purchaseDate} />
				</div>
			</div>
			<div className="flex flex-row items-stretch gap-x-3.5 flex-1">
				{item.priority !== ItemPriority.Normal && (
					<div className="flex flex-col items-center justify-center gap-2 shrink-0">
						{/* Priority */}
						<ItemPriorityIcon priority={item.priority} />
					</div>
				)}
				{/*  */}
				<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
					{/* Title + Notes */}
					<div className="flex flex-col flex-1">
						{/* Title */}
						{item.url ? (
							<Link href={item.url!} target="_blank" className={`flex flex-col gap-0.5 overflow-hidden hover:underline`}>
								{item.title}
							</Link>
						) : (
							<div>{item.title}</div>
						)}
						{/* Notes */}
						{item.notes && (
							<div className="text-sm break-words text-foreground/75">
								<MarkdownBlock>{item.notes}</MarkdownBlock>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="flex-col items-center hidden gap-1 sm:flex">
				<PurchaseDate purchaseDate={purchaseDate} />
				<TotalCost item={item} />
			</div>
		</div>
	)
}
