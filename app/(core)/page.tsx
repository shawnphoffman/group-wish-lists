import GroupedLists from '@/components/GroupedLists'

export default async function Lists() {
	return (
		<div className="w-full animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<div className="flex-1 flex flex-col gap-6">
				<h1>Lists</h1>
				<GroupedLists />
			</div>
		</div>
	)
}
