import { List } from '@/components/types'

import ImportMarkdown from './ImportMarkdown'

type Props = {
	listId: List['id']
}

export default function ImportItems({ listId }: Props) {
	return (
		<div className="border-container" id="import-items">
			<h4>Import from Apple Notes</h4>
			<div className="flex flex-col gap-1.5 items-stretch p-2">
				<ImportMarkdown listId={listId} />
			</div>
		</div>
	)
}
