import Link from 'next/link'

import TypeIcon from '@/components/icons/TypeIcon'

import Badge from '../Badge'
import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import ArchiveListButton from './buttons/ArchiveListButton'
import DeleteListButton from './buttons/DeleteListButton'
import UnarchiveListButton from './buttons/UnarchiveListButton'
import { List } from './types'

type Props = {
	list: List
	canEdit: boolean
}

export default function ListRow({ list, canEdit }: Props) {
	if (!list) return null

	const isActive = list.active
	const canDelete = canEdit && !isActive
	const url = canDelete || !isActive ? undefined : canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`
	const LinkOrDiv = url ? Link : 'div'

	return (
		<div className="inline-flex items-center gap-x-3.5 py-3 px-4 text-lg font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
			<LinkOrDiv href={url!} className={`flex flex-row flex-1 items-center gap-4`}>
				<TypeIcon type={list.type} />
				<div className={!isActive ? 'line-through opacity-50' : ''}>{list.name}</div>
			</LinkOrDiv>
			<div className="flex flex-row items-center gap-4">
				<Badge className="hidden sm:inline-flex">
					<FontAwesomeIcon className="fa-sharp fa-solid fa-list" />
					{list.count}
				</Badge>
				{canEdit && !canDelete && <ArchiveListButton listId={list.id} />}
				{canDelete && (
					<>
						<UnarchiveListButton listId={list.id} />
						<DeleteListButton listId={list.id} name={list.name} />
					</>
				)}
			</div>
		</div>
	)
}
