import GroupedLists from '@/components/lists/GroupedLists'

const buttonClasses =
	'py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-teal-500 hover:bg-teal-100 hover:text-teal-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-teal-800/30 dark:hover:text-teal-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'

export default async function Lists() {
	return (
		<div className="w-full animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<div className="flex-1 flex flex-col gap-6">
				<div className="flex flex-row justify-between">
					<h1>Wish Lists</h1>
					<button type="button" className={buttonClasses} data-hs-overlay="#hs-create-list-modal">
						<i className="fa-sharp fa-solid fa-plus" aria-hidden="true"></i>
						Create List
					</button>
				</div>
				<GroupedLists />
			</div>
		</div>
	)
}
