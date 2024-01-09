export default function Textarea(props: any) {
	return (
		<textarea
			className="px-4 py-2 border block w-full border-gray-200 rounded-lg text-md disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-300"
			{...props}
		></textarea>
	)
}
