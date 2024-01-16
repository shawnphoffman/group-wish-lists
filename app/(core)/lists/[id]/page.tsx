import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getSessionUser } from '@/app/actions/auth'
import { getViewableList } from '@/app/actions/lists'

import Badge from '@/components/common/Badge'
import FallbackRow from '@/components/icons/Fallback'
import TypeIcon from '@/components/icons/TypeIcon'
import EmptyMessage from '@/components/lists/EmptyMessage'
import ListItemRow from '@/components/lists/ItemRow'
import { List, ListItem, Recipient } from '@/components/lists/types'

const RealTimeListener = dynamic(() => import('@/components/utils/RealTimeListener'), { ssr: false })

type Props = {
	params: {
		id: List['id']
	}
}

const ViewListClient = async ({ params }: Props) => {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const userPromise = getSessionUser()
	const listPromise = getViewableList(params.id)

	const [currentUser, { data, error }] = await Promise.all([
		userPromise,
		listPromise,
		// fakePromise
	])

	if (error || !data) {
		return notFound()
	}

	const items = data.listItems as unknown as ListItem[]

	const recipient = data.recipient! as unknown as Recipient
	const isListOwner = !!(currentUser?.id === data.user_id)

	return (
		<>
			{/* Header */}
			<div className="flex flex-row items-center justify-between w-full gap-2 truncate">
				<TypeIcon type={data.type} className="text-3xl" />
				<h1 className="flex-1 truncate">{data?.name}</h1>
				<Badge colorLabel={recipient.display_name} className="xxs">
					{recipient.display_name}
				</Badge>
			</div>

			{/* Items */}
			<div className="flex flex-col">
				{items?.length === 0 && <EmptyMessage />}
				<div className="flex flex-col list">{items?.map(item => <ListItemRow key={item.id} item={item} isOwnerView={isListOwner} />)}</div>
			</div>
		</>
	)
}

export default async function ViewList({ params }: Props) {
	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
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
