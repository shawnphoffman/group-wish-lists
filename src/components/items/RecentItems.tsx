import { getSessionUser } from '@/app/actions/auth'
import { getRecentItems } from '@/app/actions/items'
import { getUsers } from '@/app/actions/users'
import ErrorMessage from '@/components/common/ErrorMessage'
import { Card } from '@/components/ui/card'

// import ItemPriorityIcon from '../icons/PriorityIcon'

import ItemRowSimple from './ItemRowSimple'
import { Fragment } from 'react'

export default async function RecentItems() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	// await new Promise(resolve => setTimeout(resolve, 10000))
	const userPromise = getSessionUser()
	const itemsPromise = getRecentItems()
	const usersPromise = getUsers()

	const [currentUser, { data, error }, { data: users }] = await Promise.all([
		userPromise,
		itemsPromise,
		usersPromise,
		// fakePromise
	])

	console.log('RecentItems', { users })
	// console.log('RecentItems', { data, error })

	return (
		<div className="w-full">
			<div className="flex flex-col gap-2">
				{error && <ErrorMessage />}
				{data?.map(item => {
					const url =
						item.lists.recipient_user_id === currentUser?.id
							? `/lists/${item.lists.id}/edit#item-${item.id}`
							: `/lists/${item.lists.id}#item-${item.id}`
					const user = users?.find(user => user.user_id === item.user.user_id)
					if (user?.image) {
						item.user.image = user.image
					}
					// console.log('RecentItems', item)
					item.url = url
					return (
						<Fragment key={`group-${item.id}`}>
							<Card className="bg-accent">
								<ItemRowSimple item={item} />
							</Card>
						</Fragment>
					)
				})}
			</div>
		</div>
	)
}
