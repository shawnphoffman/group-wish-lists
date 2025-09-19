'use client'

import { ListItem, Recipient, User } from '@/components/types'

import FilterableListView from './FilterableListView'

type Props = {
	items: ListItem[]
	recipient: Recipient
	isOwner: boolean
	currentUser: any
	users: User[]
}

export default function FilterableListViewClient({ items, recipient, isOwner, currentUser, users }: Props) {
	return <FilterableListView items={items} recipient={recipient} isOwner={isOwner} currentUser={currentUser} users={users} />
}
