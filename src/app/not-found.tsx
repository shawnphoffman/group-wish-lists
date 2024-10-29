import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="flex flex-col max-w-2xl gap-8 p-4 mx-auto my-8 text-center">
			<h1 className="text-red-500 h1 card-header text-9xl">404</h1>
			<h2 className="text-3xl font-bold">Not Found</h2>
			<Link
				href="/"
				className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-red-500 border border-transparent rounded-lg gap-x-2 hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
			>
				Return Home
			</Link>
		</div>
	)
}
