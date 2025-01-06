import { getMyGifts } from '@/app/actions/gifts'
import EmptyMessage from '@/components/common/EmptyMessage'
import GiftRow from '@/components/items/GiftRow'
// import { Card, CardContent } from '@/components/ui/card'

export default async function MyReceived() {
	const giftsPromise = getMyGifts()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: gifts }] = await Promise.all([
		giftsPromise,
		//
		// fakePromise
	])

	const sortedGifts = gifts?.sort((a, b) => {
		const aDate = new Date(a.gifted_items[0]?.giftedAt)
		const bDate = new Date(b.gifted_items[0]?.giftedAt)
		return bDate.getTime() - aDate.getTime()
	})

	return (
		<div className="flex flex-col">
			{gifts?.length === 0 ? (
				<EmptyMessage />
			) : (
				<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
					{sortedGifts?.map(item => (
						//
						<GiftRow key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	)
}
