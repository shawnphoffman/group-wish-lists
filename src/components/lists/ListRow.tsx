import { faList, faLockKeyhole } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import ListTypeIcon from '@/components/icons/ListTypeIcon'
import { List, ListGiftIdeas, ListSharedWithMe, ListSharedWithOthers } from '@/components/types'
import { Badge } from '@/components/ui/badge'

import { LockIcon, ShareIcon } from '../icons/Icons'

import PrimaryListButton from './buttons/PrimaryListButton'

type Props = {
	list: List | ListSharedWithOthers | ListSharedWithMe
	canEdit: boolean
	canBePrimary?: boolean
}

const CountBadge = ({ count }: { count: number }) => (
	<Badge
		variant={'outline'}
		className={`gap-x-1.5 py-1 px-3 text-xs whitespace-nowrap inline-flex ${count > 0 ? '' : 'text-muted-foreground'}`}
	>
		<FontAwesomeIcon icon={faList} className="!hidden sm:!inline" />
		{/* <FontAwesomeIcon icon={faList} className="" /> */}
		{count}
	</Badge>
)

export default function ListRow({ list, canEdit, canBePrimary = false }: Props) {
	if (!list) return null

	const isActive = list.active
	const url = canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`
	const LinkOrDiv = url ? Link : 'div'

	const privateClasses = list?.private ? '' : ''
	const isShared = canEdit && list.editors?.length

	return (
		<div className={`!text-lg flex-row bg-transparent hover:bg-muted rounded flex ${privateClasses} p-2`}>
			<LinkOrDiv href={url!} className={`flex flex-row w-full flex-1 xs:items-center gap-2 overflow-hidden`}>
				<div className="flex flex-row items-center flex-1 gap-2 overflow-hidden">
					<ListTypeIcon type={list.type} />
					<div className={`${!isActive ? 'line-through opacity-50' : ''} leading-none text-ellipsis whitespace-nowrap overflow-hidden`}>
						{list.name}
					</div>
					{list?.private && <LockIcon className="text-sm" />}
					{isShared && <ShareIcon className="text-sm" />}
				</div>

				<div className="flex flex-row items-center justify-end gap-1 !text-lg">
					{/*  */}
					{(list as ListSharedWithOthers).editors?.length && (
						<>
							{(list as ListSharedWithOthers).editors?.map(editor => (
								<Badge key={`shared-others-${editor.user.user_id}`} variant="outline" className="!text-[10px] bg-muted whitespace-nowrap">
									{/*  */}
									{editor.user.display_name}
								</Badge>
							))}
						</>
					)}
					{/*  */}
					{(list as ListSharedWithMe).sharer_display_name && (
						<Badge variant="destructive" className="!text-[10px] whitespace-nowrap gap-1">
							{/*  */}
							<FontAwesomeIcon icon={faLockKeyhole} size="sm" /> {(list as ListSharedWithMe).sharer_display_name}
						</Badge>
					)}
					{/*  */}
					{(list as ListGiftIdeas).owner_display_name && !(list as ListGiftIdeas).is_list_owner && (
						<Badge variant="destructive" className="!text-[10px] whitespace-nowrap gap-1">
							{/*  */}
							<FontAwesomeIcon icon={faLockKeyhole} size="sm" /> {(list as ListGiftIdeas).owner_display_name}
						</Badge>
					)}
					{/*  */}
					<CountBadge count={list.count!} />

					{canBePrimary && <PrimaryListButton listId={list.id} isPrimary={list.primary} />}
				</div>
			</LinkOrDiv>
		</div>
	)
}
