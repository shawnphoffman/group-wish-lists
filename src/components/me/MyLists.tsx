import { getMyLists } from '@/app/actions/lists'
import ListBlock from '@/components/lists/ListBlock'
import { List } from '@/components/types'

export const ListType = {
	ALL: 'all',
	SHARED_WITH_ME: 'shared_with_me',
	SHARED_WITH_OTHERS: 'shared_with_others',
} as const

type Props = {
	type?: string
}

export default async function MyLists({ type = ListType.ALL }: Props) {
	const listsPromise = getMyLists(type)
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data }] = await Promise.all([
		listsPromise,
		// fakePromise
	])

	return (
		<div className="flex flex-col gap-3">
			<ListBlock lists={data as List[]} isOwner={true} />
		</div>
	)
}
