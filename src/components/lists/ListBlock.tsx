import EmptyListMessage from '@/components/common/EmptyListMessage'
import ListRow from '@/components/lists/ListRow'
import { List, ListSharedWithOthers } from '@/components/types'

type Props = {
	lists: (List | ListSharedWithOthers)[]
	isOwner: boolean
	showEmptyMessage?: boolean
	canBePrimary?: boolean
}

export default async function ListBlock({ lists, isOwner, showEmptyMessage = true, canBePrimary = false }: Props) {
	if (!lists || lists?.length === 0) return showEmptyMessage ? <EmptyListMessage /> : null

	const sortedListed = lists.sort((a, b) => {
		if (a.primary && !b.primary) return -1
		if (!a.primary && b.primary) return 1

		if (a.name && !b.name) return -1
		if (!a.name && b.name) return 1
		return a.name.localeCompare(b.name)
	})

	return (
		// <div className="flex flex-col gap-1 divide-y xs:divide-y-0">
		<div className="flex flex-col gap-1 xs:divide-y-0">
			{sortedListed.map(list => {
				const keySuffix = 'user_shared_with_id' in list ? list.user_shared_with_id : 'me'
				return <ListRow key={`${list.id}-${keySuffix}`} list={list} canEdit={isOwner} canBePrimary={canBePrimary} />
			})}
		</div>
	)
}
