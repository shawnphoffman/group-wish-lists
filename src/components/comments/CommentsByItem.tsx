import { faList } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { getSessionUser } from '@/app/actions/auth'
import { getCommentsGroupedByItem } from '@/app/actions/comments'
import ErrorMessage from '@/components/common/ErrorMessage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import ItemImage from '../items/components/ItemImage'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

import AddCommentButton from './AddCommentButton'
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

	// console.log('CommentsByItem', { listItems, error })

	return (
		<div className="w-full">
			<div className="flex flex-col gap-2">
				{error && <ErrorMessage />}
				{listItems?.map(group => {
					const item = group.listItem
					const url = item.list.recipient_user_id === currentUser?.id ? `/lists/${item.list.id}/edit` : `/lists/${item.list.id}`
					console.log('CommentsByItem', item)
					return (
						<Card key={`group-${group.item_id}`} className="bg-accent">
							<CardHeader className="flex-row items-center gap-1 py-4 pb-4">
								<CardTitle className="flex flex-col flex-wrap items-center justify-between w-full gap-2 xs:flex-row">
									<div className="flex flex-row items-center justify-center gap-2 max-xs:self-start">
										<div className="flex flex-col items-start gap-2">
											<span>{item.title}</span>
											<Badge variant="outline" className="text-muted-foreground whitespace-nowrap">
												{item.user.display_name} - {item.list.name}
											</Badge>
										</div>
										<ItemImage url={item.image_url} className="w-16 border-none max-h-16" />
									</div>
									<div className="flex flex-row gap-2 max-xs:self-end">
										<Button variant="ghost" type="button" size="icon" className="group" asChild>
											<Link href={url} className="">
												<FontAwesomeIcon
													icon={faList}
													size="lg"
													className="text-red-500 hover:text-red-600 group-hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:group-hover:text-red-300"
												/>
											</Link>
										</Button>
										<AddCommentButton itemId={item.id} />
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
								<ItemComments comments={group.listItem.item_comments} />
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
