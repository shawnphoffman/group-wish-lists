export default function ErrorMessage({ error = 'Something went wrong...' }: { error?: string }) {
	return (
		<div
			className="p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-800/10 dark:border-red-900 dark:text-red-500"
			role="alert"
		>
			<span className="font-bold">Error</span> {error}
		</div>
	)
}
