import { faList } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { faLockKeyhole } from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import ListTypeIcon from '@/components/icons/ListTypeIcon'
// import ArchiveListButton from '@/components/lists/buttons/ArchiveListButton'
// import DeleteListButton from '@/components/lists/buttons/DeleteListButton'
import { List, ListSharedWithMe, ListSharedWithOthers } from '@/components/types'
import { Badge } from '@/components/ui/badge'

import { LockIcon, ShareIcon } from '../icons/Icons'

type Props = {
	list: List | ListSharedWithOthers | ListSharedWithMe
	canEdit: boolean
}

const CountBadge = ({ count }: { count: number }) => (
	<Badge
		variant={'outline'}
		className={`hidden gap-x-1.5 py-1 px-3 text-xs whitespace-nowrap xs:inline-flex ${count > 0 ? '' : 'text-muted-foreground'}`}
	>
		<FontAwesomeIcon icon={faList} className="!hidden sm:!inline" />
		{count}
	</Badge>
)

export default function ListRow({ list, canEdit }: Props) {
	if (!list) return null

	const isActive = list.active
	const url = canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`
	const LinkOrDiv = url ? Link : 'div'

	const privateClasses = list?.private ? '' : ''
	const isShared = canEdit && list.editors?.length

	// console.log('ListRow', list)

	return (
		<div className={`xs:!text-lg flex-row p-2 bg-transparent hover:bg-muted rounded flex ${privateClasses}`}>
			<LinkOrDiv href={url!} className={`flex flex-row flex-1 items-center gap-2`}>
				<ListTypeIcon type={list.type} />
				<div className={`${!isActive ? 'line-through opacity-50' : ''} leading-none`}>{list.name}</div>
				{list?.private && <LockIcon className="text-sm" />}
				{isShared && <ShareIcon className="text-sm" />}
			</LinkOrDiv>
			<div className="flex flex-row items-center justify-end gap-1 !text-lg">
				{/*  */}
				{(list as ListSharedWithOthers).user_shared_with_id && (
					<Badge variant="outline" className="!text-[10px] bg-muted whitespace-nowrap">
						{/*  */}
						w/{(list as ListSharedWithOthers).user_shared_with_display_name}
					</Badge>
				)}
				{/*  */}
				{(list as ListSharedWithMe).sharer_display_name && (
					<Badge variant="outline" className="!text-[10px] bg-muted whitespace-nowrap">
						{/*  */}
						{(list as ListSharedWithMe).sharer_display_name}
					</Badge>
				)}
				{/* {list?.private && <FontAwesomeIcon icon={faLockKeyhole} fixedWidth className="text-sm text-emerald-300" />} */}
				<CountBadge count={list.count!} />
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
