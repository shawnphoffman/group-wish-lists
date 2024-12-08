import { getSessionUser } from '@/app/actions/auth'
// import { List } from '../types'
import { getCommentsGroupedByItem } from '@/app/actions/comments'
import ErrorMessage from '@/components/common/ErrorMessage'
// import ListBlock from '@/components/lists/ListBlock'
// import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import ItemComments from './ItemComments'

export default async function CommentsByItem() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	// await new Promise(resolve => setTimeout(resolve, 10000))
	const userPromise = getSessionUser()
	const itemsPromise = getCommentsGroupedByItem()

	const [currentUser, { data: listItems, error }] = await Promise.all([
		userPromise,
		itemsPromise,
		// fakePromise
	])

	console.log('CommentsByItem', { listItems, error })

	return (
		<div className="w-full">
			<div className="flex flex-col gap-2">
				{error && <ErrorMessage />}
				{listItems?.map(group => {
					return (
						<Card key={`group-${group.item_id}`} className="bg-accent">
							<CardHeader className="flex-row items-center gap-1 py-5 pb-4">
								<CardTitle className="flex flex-wrap items-center gap-2">
									{group.listItem.title}
									{/* {group.display_name}
									{birthdayString && (
										<>
											<Badge variant="outline" className="text-muted-foreground whitespace-nowrap">
												{birthdayString}
											</Badge>
											{countdown < 31 && (
												<Badge variant="default" className="whitespace-nowrap">
													{countdown} {plural === 'one' ? 'day' : 'days'}
												</Badge>
											)}
										</>
									)} */}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
								<ItemComments comments={group.listItem.item_comments} />
								{/* <ListBlock lists={group.lists as List[]} isOwner={currentUser?.id === group.user_id} /> */}
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
