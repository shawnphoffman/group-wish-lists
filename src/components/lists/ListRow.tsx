import { faList, faStar } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import ListTypeIcon from '@/components/icons/ListTypeIcon'
import { List, ListSharedWithMe, ListSharedWithOthers } from '@/components/types'
import { Badge } from '@/components/ui/badge'

// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LockIcon, ShareIcon } from '../icons/Icons'

type Props = {
	list: List | ListSharedWithOthers | ListSharedWithMe
	canEdit: boolean
}

const CountBadge = ({ count }: { count: number }) => (
	<Badge
		variant={'outline'}
		className={`gap-x-1.5 py-1 px-3 text-xs whitespace-nowrap inline-flex ${count > 0 ? '' : 'text-muted-foreground'}`}
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

	const isPrimary = list.primary && canEdit

	// console.log('ListRow', list)

	return (
		<div className={`!text-lg flex-row p-0 bg-transparent hover:bg-muted rounded flex ${privateClasses}`}>
			<LinkOrDiv href={url!} className={`flex flex-row flex-1 items-center gap-2 overflow-hidden`}>
				<div className="flex flex-row items-center flex-1 gap-2 overflow-hidden">
					<ListTypeIcon type={list.type} />
					<div className={`${!isActive ? 'line-through opacity-50' : ''} leading-none text-ellipsis whitespace-nowrap overflow-hidden`}>
						{list.name}
					</div>
					{/* <TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							className={`${!isActive ? 'line-through opacity-50' : ''} leading-none text-ellipsis whitespace-nowrap overflow-hidden`}
						>
							{list.name}
						</TooltipTrigger>
						<TooltipContent className="max-w-60 text-pretty">{list.name}</TooltipContent>
					</Tooltip>
				</TooltipProvider> */}
					{list?.private && <LockIcon className="text-sm" />}
					{isShared && <ShareIcon className="text-sm" />}
					{isPrimary && <FontAwesomeIcon icon={faStar} className="text-yellow-500" />}
				</div>

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
							For: {(list as ListSharedWithMe).sharer_display_name}
						</Badge>
					)}
					{/*  */}
					<CountBadge count={list.count!} />
				</div>
			</LinkOrDiv>
		</div>
	)
}
