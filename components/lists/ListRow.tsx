import TypeIcon from './ListTypeIcon'
import ArchiveListButton from './buttons/ArchiveListButton'
import DeleteListButton from './buttons/DeleteListButton'
import UnarchiveListButton from './buttons/UnarchiveListButton'

export default function ListRow({ list, canEdit }: any) {
	if (!list) return null

	const isActive = list.active
	const canDelete = canEdit && !isActive
	const url = canDelete ? undefined : canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`

	return (
		<div className="inline-flex items-center gap-x-3.5 py-3 px-4 text-lg font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
			<a href={url} className={`flex flex-row flex-1 items-center gap-4`}>
				<TypeIcon type={list.type} />
				{/*  !isActive ? 'line-through opacity-50' : 'hover:text-green-500 dark:hover:text-green-500' */}
				<div className={!isActive ? 'line-through opacity-50' : 'hover:underline'}>{list.name}</div>
			</a>
			<div className="flex flex-row gap-4">
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
