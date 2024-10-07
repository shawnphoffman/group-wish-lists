import { getMyPurchases } from '@/app/actions/lists'
import EmptyMessage from '@/components/common/EmptyMessage'
import PurchaseRow from '@/components/items/PurchaseRow'
import { Card, CardContent } from '@/components/ui/card'

export default async function MyPurchases() {
	const listsPromise = getMyPurchases()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: items }] = await Promise.all([
		listsPromise,
		// fakePromise
	])

	return (
		<div className="flex flex-col">
			{items?.length === 0 && <EmptyMessage />}
			<Card className="bg-accent">
				<CardContent className="p-0 divide-y">
					{/* <div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent"> */}
					{items?.map(item => (
						//
						<PurchaseRow key={item.id} item={item} />
					))}
					{/* </div> */}
				</CardContent>
			</Card>
		</div>
	)
}
