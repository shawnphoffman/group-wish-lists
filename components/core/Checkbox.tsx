export default function Checkbox(props: any) {
	return (
		<input
			type="checkbox"
			// mt-0.5
			className="shrink-0 w-5 h-5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
			{...props}
		/>
	)
}
