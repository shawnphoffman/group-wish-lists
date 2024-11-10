import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

import { getViewableList } from '@/app/actions/lists'
import EmptyMessage from '@/components/common/EmptyMessage'
import { FallbackRowsMultiple, FallbackRowThick } from '@/components/common/Fallbacks'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import ItemRow from '@/components/items/ItemRow'
import { List, ListItem, Recipient } from '@/components/types'
import { Badge } from '@/components/ui/badge'

const RealTimeListener = dynamic(() => import('@/components/utils/RealTimeListener'))

type ClientProps = {
	params: {
		id: List['id']
	}
}

const ViewListClient = async ({ params }: ClientProps) => {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const listPromise = getViewableList(params.id)

	const [{ data, error, isOwner }] = await Promise.all([
		listPromise,
		// fakePromise
	])

	if (error || !data) {
		return notFound()
	}

	const items = data.listItems as unknown as ListItem[]
	const recipient = data.recipient! as unknown as Recipient
	const visibleItems = items.filter(item => !item.archived)

	// console.log('ViewListClient', { items, visibleItems })

	return (
		<>
			{/* Header */}
			<div className="relative flex flex-row items-center flex-initial gap-2 w-fit flex-nowrap">
				<h1 className="w-fit">{data?.name}</h1>
				<ListTypeIcon type={data.type} className="text-[80px] opacity-25 absolute left-4 -top-5 -z-10" />
				<Badge variant={'outline'}>{recipient.display_name}</Badge>
			</div>
			{/* Desc */}
			{data?.description && <div className="text-sm leading-tight text-muted-foreground">{data.description}</div>}

			{/* Items */}
			<div className="flex flex-col">
				{visibleItems?.length === 0 ? (
					<EmptyMessage />
				) : (
					<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
						{/*  */}
						{visibleItems?.map(item => (
							<Suspense key={item.id} fallback={<FallbackRowThick />}>
								<ItemRow item={item} isOwnerView={isOwner} />
							</Suspense>
						))}
					</div>
				)}
			</div>
		</>
	)
}

type Props = {
	params: Promise<{
		id: List['id']
	}>
}

export default async function ViewList(props: Props) {
	const params = await props.params
	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-4xl sm:px-2 animate-page-in">
				<div className="flex flex-col flex-1 gap-6">
					<Suspense fallback={<FallbackRowsMultiple />}>
						<ViewListClient params={params} />
					</Suspense>
				</div>
			</div>
			<RealTimeListener listId={params.id} />
		</>
	)
}
