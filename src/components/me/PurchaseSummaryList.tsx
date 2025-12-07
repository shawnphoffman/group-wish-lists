import { getMyPurchases } from '@/app/actions/gifts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User } from '@/components/types'
import { TotalCost } from '../items/PurchaseRow'

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

	// Calculate metrics
	const totalPeople = summaries.length
	const totalPurchases = summaries.reduce((sum, person) => sum + person.purchaseCount, 0)
	const peopleWithSpending = summaries.filter(person => person.totalCost > 0)
	const averageSpendPerPerson = peopleWithSpending.length > 0 ? grandTotal / peopleWithSpending.length : 0
	const averageSpendIncludingZero = totalPeople > 0 ? grandTotal / totalPeople : 0
	const averagePurchasesPerPerson = totalPeople > 0 ? totalPurchases / totalPeople : 0

	return (
		<div className="flex flex-col overflow-hidden border rounded-lg shadow-sm text-card-foreground bg-accent">
			{/* Metrics Section */}
			{summaries.length > 0 && (
				<div className="flex flex-col gap-3 p-4 border-b bg-muted/30">
					<div className="text-base font-semibold sm:text-lg">Summary Metrics</div>
					<div className="grid grid-cols-2 gap-3 text-xs sm:text-base lg:grid-cols-3">
						<div className="flex flex-col gap-1">
							<div className="text-muted-foreground">Average Spend (incl. $0)</div>
							<div className="font-medium">
								<TotalCost totalCost={averageSpendIncludingZero} className="text-xs" />
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-muted-foreground">Average Spend (excl. $0)</div>
							<div className="font-medium">
								<TotalCost totalCost={averageSpendPerPerson} className="text-xs" />
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-muted-foreground">Total People (incl. $0)</div>
							<div className="font-medium">{totalPeople}</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-muted-foreground">Total People (excl. $0)</div>
							<div className="font-medium">{peopleWithSpending.length}</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-muted-foreground">Total Purchases</div>
							<div className="font-medium">{totalPurchases}</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-muted-foreground">Avg Purchases/Person</div>
							<div className="font-medium">{averagePurchasesPerPerson.toFixed(1)}</div>
						</div>
					</div>
				</div>
			)}
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
							<div className="flex flex-col items-start justify-center gap-1">
								<div className="font-medium leading-none">{person.recipient_display_name}</div>
								<div className="text-xs leading-none text-muted-foreground">
									{person.purchaseCount} {person.purchaseCount === 1 ? 'purchase' : 'purchases'}
								</div>
							</div>
						</div>
						<div className="flex flex-col items-end">
							<TotalCost totalCost={person.totalCost} className="text-xs" />
						</div>
					</div>
				</div>
			))}
			{summaries.length > 0 && (
				<div className="flex flex-row items-center justify-between gap-4 p-2 border-t bg-muted/50">
					<div className="font-semibold">Total</div>
					<TotalCost totalCost={grandTotal} className="text-xs" />
				</div>
			)}
		</div>
	)
}
