import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

import { getViewableList } from '@/app/actions/lists'
import EmptyMessage from '@/components/common/EmptyMessage'
import FallbackRow from '@/components/common/Fallbacks'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import ItemRow from '@/components/items/ItemRow'
import { List, ListItem, Recipient } from '@/components/types'
import { Badge } from '@/components/ui/badge'

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
			<div className="relative flex flex-row items-center flex-initial gap-2 w-fit flex-nowrap">
				<h1 className="w-fit">{data?.name}</h1>
				<ListTypeIcon type={data.type} className="text-[80px] opacity-25 absolute left-4 -top-5 -z-10" />
				<Badge variant={'outline'}>{recipient.display_name}</Badge>
			</div>

			{/* Items */}
			<div className="flex flex-col">
				{items?.length === 0 ? (
					<EmptyMessage />
				) : (
					<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
						{/*  */}
						{items?.map(item => <ItemRow key={item.id} item={item} isOwnerView={isOwner} />)}
					</div>
				)}
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
