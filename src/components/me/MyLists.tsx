import { getMyLists } from '@/app/actions/lists'
import ListBlock from '@/components/lists/ListBlock'
import { List } from '@/components/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
		<Card className="bg-accent">
			<CardContent className="py-5">
				<ListBlock lists={data as List[]} isOwner={true} />
			</CardContent>
		</Card>
	)
}