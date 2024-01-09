export default function Select(props: any) {
	return (
		<select
			className="py-2 px-4 pe-9 block w-full border text-md border-gray-200 rounded-lg focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
			{...props}
		></select>
	)
}
