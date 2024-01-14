import { getSessionUser } from '@/app/actions/auth'
import { getListsGroupedByUser } from '@/app/actions/lists'

// import { fakeAsync } from '@/app/actions/test'
import ErrorMessage from './GenericErrorMessage'
import ListBlock from './ListBlock'

export default async function GroupedLists() {
	// const fakePromise = fakeAsync(5500)
	const userPromise = getSessionUser()
	const listsPromise = getListsGroupedByUser()

	const [currentUser, { data: groupedLists, error }] = await Promise.all([userPromise, listsPromise /*, fakePromise*/])

	return (
		<div className="container px-4 mx-auto">
			<div className="flex flex-col">
				{error && <ErrorMessage />}

				{groupedLists?.map(group => (
					<div key={`group-${group.id}`} className={`flex flex-col mb-8 `}>
						<h2 className="mb-2 text-2xl dark:text-white">{group.display_name}</h2>
						<ListBlock lists={group.lists} isOwner={currentUser?.id === group.user_id} />
					</div>
				))}
			</div>
		</div>
	)
}
