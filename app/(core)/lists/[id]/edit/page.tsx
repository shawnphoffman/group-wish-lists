import { notFound } from 'next/navigation'

import { getEditableList } from '@/app/actions/lists'

import Avatar from '@/components/Avatar'
import RealTimeListener from '@/components/RealTimeListener'
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

export default async function EditList({ params }: Props) {
	const { data, error } = await getEditableList(params.id)
	if (error || !data) {
		return notFound()
	}

	const items = data.listItems as unknown as ListItem[]
	const recipient = data.recipient! as unknown as Recipient

	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
			<div className="flex flex-col flex-1 gap-6">
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
			</div>

			<RealTimeListener listId={params.id} />
		</div>
	)
}
