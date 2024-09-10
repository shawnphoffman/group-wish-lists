import { Suspense } from 'react'

import { getMyLists } from '@/app/actions/lists'
import FallbackRow from '@/components/common/Fallbacks'
import AddItemForm from '@/components/items/forms/AddItemForm'
import { ListType } from '@/components/me/MyLists'
import { List } from '@/components/types'

export default async function ImportItem() {
	const listsPromise = getMyLists(ListType.ALL)
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data }] = await Promise.all([
		listsPromise,
		// fakePromise
	])

	const list = (data as List[])[0]

	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 px-3 opacity-0 max-md:gap-2 animate-in">
			{/* Header */}
			<div className="flex flex-row justify-between">
				<h1>Import Item</h1>
			</div>
			<div>
				The item that you are trying to import should be prepopulated below. Just click the "import" ⬇️ button to fetch additional
				information.
			</div>
			<div>TODO List Picker: {list.name}</div>
			{/* Add Item */}
			<div className="border-container" id="add-item">
				<h4>Add Item</h4>
				<Suspense fallback={<FallbackRow />}>
					<div className="flex flex-col items-stretch gap-2 p-2">
						<AddItemForm listId={list.id} />
					</div>
				</Suspense>
			</div>
		</div>
	)
}
