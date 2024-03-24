import EmptyMessage from '../common/EmptyMessage'
import PurchaseRow from '../items/PurchaseRow'

import { getMyPurchases } from '@/app/actions/lists'

export default async function MyPurchases() {
	const listsPromise = getMyPurchases()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: items }] = await Promise.all([
		listsPromise,
		// fakePromise
	])

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col">
				{items?.length === 0 && <EmptyMessage />}
				<div className="flex flex-col list">{items?.map(item => <PurchaseRow key={item.id} item={item} />)}</div>
			</div>
		</div>
	)
}
