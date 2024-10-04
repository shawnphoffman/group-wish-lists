import EmptyMessage from '@/components/common/EmptyMessage'
import ListRow from '@/components/lists/ListRow'
import { List, ListSharedWithOthers } from '@/components/types'

type Props = {
	lists: (List | ListSharedWithOthers)[]
	isOwner: boolean
}

export default async function ListBlock({ lists, isOwner }: Props) {
	if (lists?.length === 0) return <EmptyMessage />
	return (
		<div className="flex flex-col">
			{lists.map(list => (
				<ListRow key={list.id} list={list} canEdit={isOwner} />
			))}
		</div>
	)
}