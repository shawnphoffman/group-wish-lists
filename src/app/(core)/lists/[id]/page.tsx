import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

import { getViewableList } from '@/app/actions/lists'
import Badge from '@/components/common/Badge'
import EmptyMessage from '@/components/common/EmptyMessage'
import FallbackRow from '@/components/common/Fallbacks'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import ItemRow from '@/components/items/ItemRow'
import { List, ListItem, Recipient } from '@/components/types'

const RealTimeListener = dynamic(() => import('@/components/utils/RealTimeListener'), { ssr: false })

type Props = {
	params: {
		id: List['id']
	}
}

const ViewListClient = async ({ params }: Props) => {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const listPromise = getViewableList(params.id)

	const [{ data, error, isOwner }] = await Promise.all([
		listPromise,
		// fakePromise
	])

	if (error || !data) {
		return notFound()
	}

	// console.log('ViewListClient', { data })

	const items = data.listItems as unknown as ListItem[]
	const recipient = data.recipient! as unknown as Recipient

	return (
		<>
			{/* Header */}
			<div className="flex flex-row items-center flex-initial gap-2 w-fit flex-nowrap">
				<ListTypeIcon type={data.type} className="text-3xl" />
				<h1 className="w-fit">{data?.name}</h1>
				<Badge colorId={recipient.id} className="xxs">
					{recipient.display_name}
				</Badge>
			</div>

			{/* Items */}
			<div className="flex flex-col">
				{items?.length === 0 && <EmptyMessage />}
				<div className="flex flex-col list">{items?.map(item => <ItemRow key={item.id} item={item} isOwnerView={isOwner} />)}</div>
			</div>
		</>
	)
}

export default async function ViewList({ params }: Props) {
	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-4xl px-3 ">
				<div className="flex flex-col flex-1 gap-6">
					<Suspense fallback={<FallbackRow />}>
						<ViewListClient params={params} />
					</Suspense>
				</div>
			</div>
			<RealTimeListener listId={params.id} />
		</>
	)
}
