import Link from 'next/link'

import TypeIcon from '@/components/icons/TypeIcon'

import Badge from '../common/Badge'
import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import ArchiveListButton from './buttons/ArchiveListButton'
import DeleteListButton from './buttons/DeleteListButton'
import { List } from './types'

type Props = {
	list: List
	canEdit: boolean
}

const CountBadge = ({ count }: { count: number }) => (
	<Badge className="hidden blue xs:inline-flex">
		<FontAwesomeIcon className="!hidden sm:!inline fa-sharp fa-solid fa-list" />
		{count}
	</Badge>
)

export default function ListRow({ list, canEdit }: Props) {
	if (!list) return null

	const isActive = list.active
	const canDelete = canEdit && !isActive
	const url = canDelete || !isActive ? undefined : canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`
	const LinkOrDiv = url ? Link : 'div'

	return (
		<div className={`list-item xs:!text-lg`}>
			<LinkOrDiv href={url!} className={`flex flex-row flex-1 items-center gap-4`}>
				<TypeIcon type={list.type} />
				<div className={!isActive ? 'line-through opacity-50' : ''}>{list.name}</div>
			</LinkOrDiv>
			<div className="flex flex-row items-center justify-end gap-4 !text-lg">
				<CountBadge count={list.count!} />
				{canEdit && (
					<>
						<ArchiveListButton listId={list.id} isArchived={!isActive} />
						<DeleteListButton listId={list.id} name={list.name} />
					</>
				)}
			</div>
		</div>
	)
}
