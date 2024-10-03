import { faList } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { faLockKeyhole } from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import ListTypeIcon from '@/components/icons/ListTypeIcon'
// import ArchiveListButton from '@/components/lists/buttons/ArchiveListButton'
// import DeleteListButton from '@/components/lists/buttons/DeleteListButton'
import { List, ListSharedWithMe, ListSharedWithOthers } from '@/components/types'
import { Badge } from '@/components/ui/badge'

type Props = {
	list: List | ListSharedWithOthers | ListSharedWithMe
	canEdit: boolean
}

const CountBadge = ({ count }: { count: number }) => (
	<Badge variant={'outline'} className={`hidden text-sm whitespace-nowrap xs:inline-flex ${count > 0 ? '' : 'text-muted-foreground'}`}>
		<FontAwesomeIcon icon={faList} className="!hidden sm:!inline" />
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
		<div
			className={`xs:!text-lg flex-row p-2 hover:bg-muted rounded flex ${list?.private ? '!bg-emerald-950/50 hover:!bg-emerald-900/50' : ''}`}
		>
			<LinkOrDiv href={url!} className={`flex flex-row flex-1 items-center gap-2`}>
				<ListTypeIcon type={list.type} isPrivate={list?.private} />
				<div className={`${!isActive ? 'line-through opacity-50' : ''} leading-none`}>{list.name}</div>
			</LinkOrDiv>
			<div className="flex flex-row items-center justify-end gap-1 !text-lg">
				{/*  */}
				{(list as ListSharedWithOthers).user_shared_with_id && (
					<Badge className="!text-[10px] whitespace-nowrap">w/{(list as ListSharedWithOthers).user_shared_with_display_name}</Badge>
				)}
				{/*  */}
				{(list as ListSharedWithMe).sharer_display_name && (
					<Badge className="!text-[10px] whitespace-nowrap">{(list as ListSharedWithMe).sharer_display_name}</Badge>
				)}
				<CountBadge count={list.count!} />
				{list?.private && <FontAwesomeIcon icon={faLockKeyhole} fixedWidth className="text-sm text-emerald-300" />}
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
