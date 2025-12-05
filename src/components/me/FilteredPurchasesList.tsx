import PurchaseRow from '@/components/items/PurchaseRow'
import { getMyPurchases } from '@/app/actions/gifts'
import PurchaseAddonRow from '@/components/items/PurchaseAddonRow'

type PurchaseItem = Awaited<ReturnType<typeof getMyPurchases>>[number]

type FilteredPurchasesListProps = {
	items: PurchaseItem[]
}

export default function FilteredPurchasesList({ items }: FilteredPurchasesListProps) {
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
