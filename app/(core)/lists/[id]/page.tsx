import { notFound } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'
import { getViewableList } from '@/app/actions/lists'

import Avatar from '@/components/Avatar'
import RealTimeListener from '@/components/RealTimeListener'
import EmptyMessage from '@/components/lists/EmptyMessage'
import ListItemRow from '@/components/lists/ItemRow'
import { List, ListItem, Recipient } from '@/components/lists/types'

type Props = {
	params: {
		id: List['id']
	}
}

export default async function ViewList({ params }: Props) {
	// TODO Suspense refactor

	const userPromise = getSessionUser()
	const listPromise = getViewableList(params.id)

	const [currentUser, { data, error }] = await Promise.all([userPromise, listPromise])

	if (error || !data) {
		return notFound()
	}

	const items = data.listItems as unknown as ListItem[]

	const recipient = data.recipient! as unknown as Recipient
	const isListOwner = !!(currentUser?.id === data.user_id)

	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
				<div className="flex flex-col flex-1 gap-6">
					<div className="flex flex-row items-center justify-between gap-2">
						<div className="flex flex-row items-center gap-4">
							<h1 className="">{data?.name}</h1>
						</div>
						<Avatar name={recipient.display_name} />
					</div>

					{items?.length === 0 && <EmptyMessage />}
					<div className="container px-4 mx-auto">
						<div className="flex flex-col">
							<div className="flex flex-col">{items?.map(item => <ListItemRow key={item.id} item={item} isOwnerView={isListOwner} />)}</div>
						</div>
					</div>
				</div>
			</div>

			<RealTimeListener listId={params.id} />
		</>
	)
}
