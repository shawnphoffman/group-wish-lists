import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getEditableList } from '@/app/actions/lists'

import Avatar from '@/components/Avatar'
import RealTimeListener from '@/components/RealTimeListener'
import FallbackRow from '@/components/icons/Fallback'
import EmptyMessage from '@/components/lists/EmptyMessage'
import RenameListButton from '@/components/lists/buttons/RenameListButton'
import AddItem from '@/components/lists/create/AddItem'
import ListItemEditRow from '@/components/lists/create/ItemEditRow'
import { List, ListItem, Recipient, User } from '@/components/lists/types'

type Props = {
	params: {
		id: List['id']
	}
}

const ShowList = async ({ params }: Props) => {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const listPromise = getEditableList(params.id)

	const [{ data, error }] = await Promise.all([
		listPromise,
		// fakePromise
	])

	if (error || !data) {
		return notFound()
	}

	const items = data.listItems as unknown as ListItem[]
	const recipient = data.recipient! as unknown as Recipient
	return (
		<>
			{/* Header */}
			<div className="flex flex-row items-center justify-between gap-2">
				<div className="flex flex-row items-center gap-4">
					<RenameListButton listId={params.id} name={data.name} />
				</div>
				<Avatar name={recipient.display_name} className="hidden md:inline-flex" />
			</div>

			{/* Rows */}
			<div className="flex flex-col">
				{items?.length === 0 && <EmptyMessage />}
				<div className="flex flex-col">{items?.map(item => <ListItemEditRow key={item.id} item={item} />)}</div>
			</div>
			{/* Add Item */}
			<AddItem listId={params.id} />
		</>
	)
}

export default async function EditList({ params }: Props) {
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
			<div className="flex flex-col flex-1 gap-6">
				<Suspense fallback={<FallbackRow />}>
					<ShowList params={params} />
				</Suspense>
			</div>
			<RealTimeListener listId={params.id} />
		</div>
	)
}
