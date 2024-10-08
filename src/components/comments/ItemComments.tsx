import { ListItem } from '@/components/types'

import ItemComment from './ItemComment'

type Props = {
	comments: ListItem['item_comments']
}

export default function ItemComments({ comments }: Props) {
	if (!comments?.length) return null

	return (
		<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
			{comments?.map(comment => <ItemComment key={comment.id} comment={comment} />)}
		</div>
	)
}
