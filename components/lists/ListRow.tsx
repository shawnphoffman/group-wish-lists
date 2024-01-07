import TypeIcon from './ListTypeIcon'

export default function ListRow({ list, canEdit }: any) {
	if (!list) return null

	const url = canEdit ? `/lists/${list.id}/edit` : `/lists/${list.id}`

	return (
		<a
			className="inline-flex items-center gap-x-3.5 py-3 px-4 text-lg font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg hover:text-green-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:text-green-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
			href={url}
		>
			<TypeIcon type={list.type} />
			<div className="flex-1">{list.name}</div>
			{canEdit && <i className={`fa-sharp fa-solid fa-pen-to-square text-lg`} />}
		</a>
	)
}
