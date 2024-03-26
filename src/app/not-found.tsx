export default function NotFound() {
	return (
		<div className="mx-auto my-8 max-w-2xl gap-8 p-4 text-center flex flex-col">
			<h1 className="h1 card-header text-9xl text-red-500">404</h1>
			<h2 className="text-3xl font-bold">Not Found</h2>
			<a
				href="/"
				className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
			>
				Return Home
			</a>
		</div>
	)
}
