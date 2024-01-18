import { memo } from 'react'

import { getMyListsForSelect } from '@/app/actions/lists'

import { List, ListItem } from '@/components/types'

import MyListsSelectClient from './MyListsSelectClient'

type Props = {
	id: ListItem['id']
	listId: List['id']
}

async function MyListsSelect({ id, listId }: Props) {
	const listPromise = getMyListsForSelect()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const [{ data }] = await Promise.all([
		listPromise,
		// fakePromise
	])

	console.log('MyListsSelect.data', data)

	return <MyListsSelectClient lists={data} listId={listId} id={id} />
}

export default memo(MyListsSelect)
