import { getMyPurchases } from '@/app/actions/lists'

import ListBlock from '@/components/lists/ListBlock'
import { List } from '@/components/types'

import EmptyMessage from '../common/EmptyMessage'
import ItemRow from '../items/ItemRow'

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
				<div className="flex flex-col list">{items?.map(item => <ItemRow key={item.id} item={item} isOwnerView={false} />)}</div>
			</div>
			{/* <ListBlock lists={data as List[]} isOwner={true} /> */}
		</div>
	)
}
