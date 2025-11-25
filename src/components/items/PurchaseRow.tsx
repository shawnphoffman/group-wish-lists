import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import { Gift, ListItem, Purchase } from '@/components/types'
import { Badge } from '@/components/ui/badge'

import MarkdownBlock from './components/MarkdownBlock'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getUserById } from '@/app/actions/users'

import { formatDateBasedOnAge } from '@/utils/date'
import { ItemPriority } from '@/utils/enums'

type Props = {
	item: ListItem & Gift & Purchase
}

const PurchaseDate = ({ purchaseDate }: { purchaseDate: string | null }) => {
	if (!purchaseDate) return null
	return <Badge variant="secondary">{formatDateBasedOnAge(purchaseDate)}</Badge>
}

export default async function PurchaseRow({ item }: Props) {
	if (!item) return null

	const purchaseDate = item?.gift_created_at ? new Date(item.gift_created_at).toDateString() : null

	const recipient = item?.recipient_user_id ? await getUserById(item.recipient_user_id) : null

	return (
		<div className="flex flex-col w-full gap-2 p-3 sm:flex-row hover:bg-muted">
			{/* Recipient */}
			<div className="flex flex-row items-center justify-between gap-1">
				<div className="flex flex-row items-center gap-1">
					{recipient && (
						<Avatar className="border w-7 h-7 border-foreground">
							<AvatarImage src={recipient.image} />
							<AvatarFallback className="text-xl font-bold bg-background text-foreground">
								{recipient.display_name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
					)}
					<Badge variant="outline">{item.recipient_display_name}</Badge>
				</div>
				<div className="flex items-center gap-1 sm:hidden">
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
						<div>{item.title}</div>
						{/* Notes */}
						{item.notes && (
							<div className="text-sm break-words text-foreground/75">
								<MarkdownBlock>{item.notes}</MarkdownBlock>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="flex-row items-center hidden gap-1 sm:flex">
				<PurchaseDate purchaseDate={purchaseDate} />
			</div>
		</div>
	)
}
