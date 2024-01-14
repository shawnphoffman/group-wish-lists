import ListRow from '@/components/lists/ListRow'

import EmptyMessage from './EmptyMessage'
import { List } from './types'

type Props = {
	lists: List[]
	isOwner: boolean
}

export default async function ListBlock({ lists, isOwner }: Props) {
	if (lists?.length === 0) return <EmptyMessage />
	return (
		<div className="flex flex-col">
			{lists.sort((a, b) => a.id - b.id)?.map(list => <ListRow key={list.id} list={list} canEdit={isOwner} />)}
		</div>
	)
}
