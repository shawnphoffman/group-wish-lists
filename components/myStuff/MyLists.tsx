import { getMyLists } from '@/app/actions/lists'

import ListBlock from '../lists/ListBlock'
import { List } from '../lists/types'

export default async function MyLists() {
	const listsPromise = getMyLists()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data, error }] = await Promise.all([
		listsPromise,
		// fakePromise
	])

	return (
		<div className="flex flex-col gap-3">
			<ListBlock lists={data as List[]} isOwner={true} />
		</div>
	)
}
