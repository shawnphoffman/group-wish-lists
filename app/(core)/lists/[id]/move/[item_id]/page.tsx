import { Suspense } from 'react'

import { getMyLists } from '@/app/actions/lists'

import FallbackRow from '@/components/common/Fallbacks'
import { List, ListItem } from '@/components/types'

type Props = {
	params: {
		id: List['id']
		item_id: ListItem['id']
	}
}
export default async function MoveListItem({ params }: Props) {
	const { data: lists } = await getMyLists()

	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
			<h1>Move Item: {params.item_id}</h1>
			<p>Current List: {params.id}</p>

			<h2>Move item to:</h2>
			<Suspense fallback={<FallbackRow />}>
				<div className="flex flex-col">{lists?.map(list => <p key={list.id}>{list.name}</p>)}</div>
			</Suspense>
		</div>
	)
}
