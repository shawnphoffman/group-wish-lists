import { getSessionUser } from '@/app/actions/auth'
import { getListsGroupedByUser } from '@/app/actions/lists'

import ErrorMessage from '@/components/common/ErrorMessage'
import ListBlock from '@/components/lists/ListBlock'

import Badge from '../common/Badge'
import { List } from '../types'

export default async function ListsByUser() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const userPromise = getSessionUser()
	const listsPromise = getListsGroupedByUser()

	const [currentUser, { data: groupedLists, error }] = await Promise.all([
		userPromise,
		listsPromise,
		// fakePromise
	])

	return (
		<div className="container px-4 mx-auto">
			<div className="flex flex-col gap-4">
				{error && <ErrorMessage />}

				{groupedLists?.map(group => (
					<div key={`group-${group.id}`} className={`flex flex-col gap-1`}>
						{/* <h2 className="mb-2 text-2xl dark:text-white">{group.display_name}</h2> */}
						<Badge className="self-start !text-base" colorId={group.id}>
							{group.display_name}
						</Badge>
						<ListBlock lists={group.lists as List[]} isOwner={currentUser?.id === group.user_id} />
					</div>
				))}
			</div>
		</div>
	)
}
