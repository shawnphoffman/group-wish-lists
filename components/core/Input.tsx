export default function Input(props: any) {
	// return <input className="rounded-md px-4 py-2 bg-inherit border mb-4 disabled:opacity-50 disabled:pointer-events-none" {...props}></input>
	return (
		<input
			// mb-4
			className=" px-4 py-2 block w-full border border-gray-200 rounded-lg text-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 "
			{...props}
		></input>
	)
}

// className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
