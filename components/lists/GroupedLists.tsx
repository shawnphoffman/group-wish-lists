import { getUser } from '@/app/actions/auth'
import { getGroupedLists } from '@/app/actions/lists'

import ListBlock from './ListBlock'

export default async function GroupedLists() {
	const { data: groups, error } = await getGroupedLists()
	const { data } = await getUser()
	const userId = data?.user?.id

	return (
		<div className="container px-4 mx-auto">
			<div className="flex flex-col">
				{error && <p className="text-red-500">Something went wrong...</p>}
				{groups?.map(group => (
					<div key={group.email} className={`flex flex-col mb-8 `}>
						<h2 className="mb-2 text-2xl dark:text-white">{group.name || group.email}</h2>
						<ListBlock lists={group.lists} isOwner={userId === group.id} />
					</div>
				))}
			</div>
		</div>
	)
}
