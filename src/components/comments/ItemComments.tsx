import { faComment } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistance, subDays } from 'date-fns'

import { ListItem } from '@/components/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Badge } from '../ui/badge'

type Props = {
	// itemId: ListItem['id']
	comments: ListItem['item_comments']
}

export default function ItemComments({ comments }: Props) {
	// console.log('comments:', comments)
	return (
		<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
			{comments?.map(comment => (
				<Alert key={comment.id} className="border-0 rounded-none">
					<FontAwesomeIcon icon={faComment} className="!text-secondary" />
					<AlertTitle className="flex items-center gap-2">
						<span>{comment.user.display_name}</span>
						<Badge variant={'outline'} className="text-[11px]">
							{formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}
						</Badge>
					</AlertTitle>
					<AlertDescription>{comment.comments}</AlertDescription>
				</Alert>
			))}
		</div>
	)
}
