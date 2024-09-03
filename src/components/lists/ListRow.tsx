import Link from 'next/link'

import Badge from '@/components/common/Badge'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
// import ArchiveListButton from '@/components/lists/buttons/ArchiveListButton'
// import DeleteListButton from '@/components/lists/buttons/DeleteListButton'
import { List, ListSharedWithMe, ListSharedWithOthers } from '@/components/types'

type Props = {
	list: List | ListSharedWithOthers | ListSharedWithMe
	canEdit: boolean
}

const CountBadge = ({ count }: { count: number }) => (
	<Badge className={`hidden xs:inline-flex ${count > 0 ? 'blue' : 'gray'}`}>
		<FontAwesomeIcon className="!hidden sm:!inline fa-sharp fa-solid fa-list" />
		{count}
	</Badge>
)

export default function ListRow({ list, canEdit }: Props) {
	if (!list) return null

	const isActive = list.active
	// const canDelete = canEdit && !isActive
	// const url = canDelete || !isActive ? undefined : canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`
	const url = canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`
	const LinkOrDiv = url ? Link : 'div'

	return (
		<div className={`list-item xs:!text-lg ${list?.private ? '!bg-emerald-950/50 hover:!bg-emerald-900/50' : ''}`}>
			<LinkOrDiv href={url!} className={`flex flex-row flex-1 items-center gap-2`}>
				<ListTypeIcon type={list.type} isPrivate={list?.private} />
				<div className={!isActive ? 'line-through opacity-50' : ''}>{list.name}</div>
			</LinkOrDiv>
			<div className="flex flex-row items-center justify-end gap-1 !text-lg">
				{/*  */}
				{(list as ListSharedWithOthers).user_shared_with_id && (
					<Badge className="!text-[10px]" colorId={(list as ListSharedWithOthers).user_shared_with_id}>
						w/{(list as ListSharedWithOthers).user_shared_with_display_name}
					</Badge>
				)}
				{/*  */}
				{(list as ListSharedWithMe).sharer_display_name && (
					<Badge className="!text-[10px]" colorId={(list as ListSharedWithMe).sharer_id}>
						{(list as ListSharedWithMe).sharer_display_name}
					</Badge>
				)}
				<CountBadge count={list.count!} />
				{list?.private && <FontAwesomeIcon className="text-sm fa-duotone fa-fw fa-lock-keyhole text-emerald-300" />}
				{/* {canEdit && (
					<>
						<ArchiveListButton listId={list.id} isArchived={!isActive} />
						<DeleteListButton listId={list.id} name={list.name} />
					</>
				)} */}
			</div>
		</div>
	)
}
