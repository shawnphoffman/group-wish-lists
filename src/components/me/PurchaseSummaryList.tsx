import { getMyPurchases } from '@/app/actions/gifts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User } from '@/components/types'

type PurchaseItem = Awaited<ReturnType<typeof getMyPurchases>>[number]

type PurchaseSummaryListProps = {
	items: PurchaseItem[]
	currentUserId: string | null
}

type PersonSummary = {
	recipient: User | null | undefined
	recipient_user_id: string | null | undefined
	recipient_display_name: string | undefined
	totalCost: number
	purchaseCount: number
}

export default function PurchaseSummaryList({ items, currentUserId }: PurchaseSummaryListProps) {
	// Group purchases by recipient_user_id
	const summaryByPerson: Record<string, PersonSummary> = items.reduce(
		(acc, item) => {
			const recipientId = item.recipient_user_id || 'unknown'

			if (!acc[recipientId]) {
				acc[recipientId] = {
					recipient: item.recipient,
					recipient_user_id: item.recipient_user_id,
					recipient_display_name: item.recipient_display_name || 'Unknown',
					totalCost: 0,
					purchaseCount: 0,
				}
			}

			const cost = item.total_cost || 0
			acc[recipientId].totalCost += cost
			acc[recipientId].purchaseCount += 1

			return acc
		},
		{} as Record<string, PersonSummary>
	)

	// Convert to array, filter out current user, and sort by total cost (descending)
	const summaries: PersonSummary[] = Object.values(summaryByPerson)
		.filter(person => person.recipient_user_id !== currentUserId)
		.sort((a, b) => b.totalCost - a.totalCost)

	// Calculate grand total
	const grandTotal = summaries.reduce((sum, person) => sum + person.totalCost, 0)

	return (
		<div className="flex flex-col overflow-hidden border rounded-lg shadow-sm text-card-foreground bg-accent">
			{summaries.map((person, index) => (
				<div
					key={person.recipient_user_id || `unknown-${index}`}
					className="flex flex-col w-full gap-2 p-2 border-b last:border-b-0 hover:bg-muted"
				>
					<div className="flex flex-row items-center justify-between gap-4">
						<div className="flex flex-row items-center gap-3">
							{person.recipient && (
								<Avatar className="w-10 h-10 border">
									<AvatarImage src={person.recipient.image} />
									<AvatarFallback className="text-lg font-bold bg-background text-foreground">
										{person.recipient.display_name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
							)}
							<div className="flex flex-col">
								<div className="font-medium">{person.recipient_display_name}</div>
								<div className="text-sm text-muted-foreground">
									{person.purchaseCount} {person.purchaseCount === 1 ? 'purchase' : 'purchases'}
								</div>
							</div>
						</div>
						<div className="flex flex-col items-end">
							<Badge variant="outline" className="bg-green-800 ">
								${person.totalCost.toFixed(2)}
							</Badge>
						</div>
					</div>
				</div>
			))}
			{summaries.length > 0 && (
				<div className="flex flex-row items-center justify-between gap-4 p-4 border-t bg-muted/50">
					<div className="font-semibold">Total</div>
					<Badge variant="outline" className="px-3 py-1 bg-green-900 ">
						${grandTotal.toFixed(2)}
					</Badge>
				</div>
			)}
		</div>
	)
}
