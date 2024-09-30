'use client'

import { Suspense, useCallback, useState } from 'react'

import FallbackRow from '@/components/common/Fallbacks'
import AddItemForm from '@/components/items/forms/AddItemForm'

import { List } from '../types'

export default function ImportUrlClient({ lists, list }: { lists: List[]; list: List }) {
	const [selectedList, setSelectedList] = useState<number>(list.id)

	const handleChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedList(parseInt(e.target.value))
	}, [])

	return (
		<>
			<div>
				<label className="label">What list do you want to add this to?</label>
				<select name="priority" value={selectedList} onChange={handleChangePriority}>
					{/* <option disabled value=""></option> */}
					{lists.map((list: List) => (
						<option key={list.id} value={list.id}>
							{list.name}
							{list.private && <> (private)</>}
							{list.primary && <> ✅</>}
						</option>
					))}
				</select>
			</div>

			{/* Add Item */}
			<div className="border-container" id="add-item">
				<h4>Add Item</h4>
				<Suspense fallback={<FallbackRow />}>
					<div className="flex flex-col items-stretch gap-2 p-2">
						<AddItemForm listId={selectedList} />
					</div>
				</Suspense>
			</div>
		</>
	)
}
