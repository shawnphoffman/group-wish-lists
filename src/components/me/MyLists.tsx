import { getMyLists } from '@/app/actions/lists'
import ListBlock from '@/components/lists/ListBlock'
import { List } from '@/components/types'
import { Card, CardContent } from '@/components/ui/card'

export const ListType = {
	ALL: 'all',
	PRIVATE: 'private',
	PUBLIC: 'public',
	SHARED_WITH_ME: 'shared_with_me',
	SHARED_WITH_OTHERS: 'shared_with_others',
	GIFT_IDEAS: 'gift_ideas',
} as const

type Props = {
	type?: string
	showEmptyMessage?: boolean
}

export default async function MyLists({ type = ListType.ALL, showEmptyMessage = true }: Props) {
	const listsPromise = getMyLists(type)

	const canBePrimary = type === ListType.PUBLIC

	const [{ data }] = await Promise.all([listsPromise])

	return (
		<Card className="bg-accent">
			<CardContent className="p-1">
				<ListBlock lists={data as List[]} isOwner={true} showEmptyMessage={showEmptyMessage} canBePrimary={canBePrimary} />
			</CardContent>
		</Card>
	)
}
