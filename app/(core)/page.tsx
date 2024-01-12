import GroupedLists from '@/components/lists/GroupedLists'

export default async function Lists() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
			<div className="flex flex-col flex-1 gap-6">
				<div className="flex flex-col justify-between xs:flex-row">
					<h1>Wish Lists</h1>
					<button type="button" className="mt-4 nav-btn green xs:mt-0" data-hs-overlay="#hs-create-list-modal">
						<i className="fa-sharp fa-solid fa-plus" aria-hidden="true"></i>
						Create List
					</button>
				</div>
				<GroupedLists />
			</div>
		</div>
	)
}
