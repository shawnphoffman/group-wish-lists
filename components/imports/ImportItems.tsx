import { List } from '@/components/types'

import { isDeployed } from '@/utils/environment'

type Props = {
	listId: List['id']
}

export default function ImportItems({ listId }: Props) {
	if (isDeployed) return null
	return (
		<div className="border-container" id="import-items">
			<h4>Import Items</h4>
			{/*  */}
			<div className="flex flex-col gap-1.5 items-stretch p-2">
				<h5>Import Amazon List</h5>
				<div className="flex flex-row items-center justify-center gap-2">
					<input type="url" placeholder="TODO" />
					<button className="btn teal" disabled>
						Import
					</button>
				</div>
			</div>
			{/*  */}
			<div className="flex flex-col gap-1.5 items-stretch p-2">
				<h5>Import from Apple Notes</h5>
				<div className="flex flex-row items-center justify-center gap-2">
					<textarea placeholder="TODO" rows={4} name="import-notes"></textarea>
					<button className="btn teal" disabled>
						Import
					</button>
				</div>
			</div>
		</div>
	)
}
