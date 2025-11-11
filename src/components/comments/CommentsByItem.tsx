import { getSessionUser } from '@/app/actions/auth'
import { getCommentsGroupedByItem } from '@/app/actions/comments'
import ErrorMessage from '@/components/common/ErrorMessage'
import { Card } from '@/components/ui/card'

import { getUsers } from '@/app/actions/users'
import ItemRowSimple from '../items/ItemRowSimple'

export default async function CommentsByItem() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	// await new Promise(resolve => setTimeout(resolve, 10000))
	const userPromise = getSessionUser()
	const itemsPromise = getCommentsGroupedByItem()
	const usersPromise = getUsers()

	const [currentUser, { data: listItems, error }, { data: users }] = await Promise.all([
		userPromise,
		itemsPromise,
		usersPromise,
		// fakePromise
	])

	// console.log('CommentsByItem', { listItems, error })

	return (
		<div className="w-full">
			<div className="flex flex-col gap-2">
				{error && <ErrorMessage />}
				{listItems?.map(group => {
					const item = group.listItem
					const url =
						item.list.recipient_user_id === currentUser?.id
							? `/lists/${item.list.id}/edit#item-${item.id}`
							: `/lists/${item.list.id}#item-${item.id}`
					item.url = url
					const user = users?.find(user => user.user_id === item.user.user_id)
					if (user?.image) {
						item.user.image = user.image
					}
					// console.log('CommentsByItem', item)
					return (
						<Card key={`group-${group.item_id}`} className="bg-accent">
							<ItemRowSimple item={item} />
						</Card>
					)
				})}
			</div>
		</div>
	)
}
