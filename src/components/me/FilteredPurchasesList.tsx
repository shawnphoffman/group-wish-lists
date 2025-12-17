import PurchaseRow from '@/components/items/PurchaseRow'
import { getMyPurchases } from '@/app/actions/gifts'
import PurchaseAddonRow from '@/components/items/PurchaseAddonRow'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type PurchaseItem = Awaited<ReturnType<typeof getMyPurchases>>[number]

type GroupedItem = {
	recipient: PurchaseItem['recipient']
	recipient_display_name: string
	items: PurchaseItem[]
}

type FilteredPurchasesListProps = {
	items: PurchaseItem[]
	groupByRecipient?: boolean
}

export default function FilteredPurchasesList({ items, groupByRecipient = false }: FilteredPurchasesListProps) {
	if (!groupByRecipient) {
		return (
			<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
				{items.map(item => {
					const itemId = `${item.gifter_id}-${item.id}`
					return item.type === 'addon' ? (
						<PurchaseAddonRow key={itemId} item={item} recipient={item.recipient} />
					) : (
						<PurchaseRow key={itemId} item={item} recipient={item.recipient} />
					)
				})}
			</div>
		)
	}

	// Group items by recipient
	const groupedItems = items.reduce(
		(acc, item) => {
			const recipientId = item.recipient_user_id || 'no-recipient'
			if (!acc[recipientId]) {
				acc[recipientId] = {
					recipient: item.recipient,
					recipient_display_name: item.recipient_display_name || 'No Recipient',
					items: [],
				}
			}
			acc[recipientId].items.push(item)
			return acc
		},
		{} as Record<string, GroupedItem>
	)

	// Sort groups: items with recipients first, then items without recipients
	const sortedGroups = (Object.entries(groupedItems) as [string, GroupedItem][]).sort(([aId], [bId]) => {
		if (aId === 'no-recipient') return 1
		if (bId === 'no-recipient') return -1
		return 0
	})

	return (
		<div className="flex flex-col gap-4">
			{sortedGroups.map(([recipientId, group]) => (
				<div
					key={recipientId}
					className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent"
				>
					{/* Group Header */}
					<div className="flex items-center gap-2 px-3 py-2 bg-muted/50">
						{group.recipient ? (
							<>
								<Avatar className="w-12 h-12 border">
									<AvatarImage src={group.recipient.image} />
									<AvatarFallback className="text-xl font-bold bg-background text-foreground">
										{group.recipient.display_name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="text-xl font-bold">{group.recipient_display_name}</div>
							</>
						) : (
							<Badge variant="outline" className="py-1">
								{group.recipient_display_name}
							</Badge>
						)}
						<span className="text-sm text-muted-foreground">
							({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
						</span>
					</div>
					{/* Group Items */}
					{group.items.map(item => {
						const itemId = `${item.gifter_id}-${item.id}`
						return item.type === 'addon' ? (
							<PurchaseAddonRow key={itemId} item={item} recipient={item.recipient} />
						) : (
							<PurchaseRow key={itemId} item={item} recipient={item.recipient} />
						)
					})}
				</div>
			))}
		</div>
	)
}
