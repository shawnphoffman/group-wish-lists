import { Gift, PurchaseAddon, Purchase } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/components/types'

import { formatDateBasedOnAge } from '@/utils/date'
import Link from 'next/link'

type Props = {
	item: PurchaseAddon & Gift & Purchase & { type: 'addon' }
	recipient?: User | null
}

const PurchaseDate = ({ purchaseDate }: { purchaseDate: string | null }) => {
	if (!purchaseDate) return null
	return <Badge variant="secondary">{formatDateBasedOnAge(purchaseDate)}</Badge>
}

export default function PurchaseAddonRow({ item, recipient }: Props) {
	if (!item) return null

	const purchaseDate = item?.gift_created_at ? new Date(item.gift_created_at).toDateString() : null

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
				<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
					{/* Title + Notes */}
					<div className="flex flex-col flex-1">
						<Link
							href={`/lists/${item.list_id}#addons`}
							target="_blank"
							className={`flex flex-col gap-0.5 overflow-hidden hover:underline`}
						>
							{item.description}
						</Link>
					</div>
				</div>
				<Badge variant="outline" className="self-center bg-yellow-700">
					Addon
				</Badge>
			</div>
			<div className="flex-row items-center hidden gap-1 sm:flex">
				<PurchaseDate purchaseDate={purchaseDate} />
			</div>
		</div>
	)
}
