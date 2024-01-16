import { Suspense } from 'react'

import FallbackRow from '@/components/icons/Fallback'

import { List } from '../types'
import AddItemForm from './AddItemForm'

type Props = {
	listId: List['id']
}

export default async function AddItem({ listId }: Props) {
	return (
		<div className="border-container" id="add-item">
			<h4>Add Item</h4>
			<Suspense fallback={<FallbackRow />}>
				<div className="flex flex-col items-stretch gap-2 p-2">
					<AddItemForm listId={listId} />
				</div>
			</Suspense>
		</div>
	)
}
