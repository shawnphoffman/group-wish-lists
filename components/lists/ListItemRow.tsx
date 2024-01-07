import Checkbox from '@/components/core/Checkbox'

export default function ListItemRow({ item }: any) {
	if (!item) return null

	return (
		<div className="inline-flex items-center gap-x-3.5 py-3 px-4 text-lg font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg hover:text-green-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:text-green-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
			<Checkbox checked={item.active} />
			<div className="flex-1">{item.title}</div>
		</div>
	)
}
