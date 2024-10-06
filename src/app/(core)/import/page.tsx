import { Suspense } from 'react'

import { getMyLists } from '@/app/actions/lists'
import ImportUrlClient from '@/components/imports/ImportUrlClient'
import { ListType } from '@/components/me/MyLists'
import { List } from '@/components/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ImportItem() {
	const listsPromise = getMyLists(ListType.ALL)
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data }] = await Promise.all([
		listsPromise,
		// fakePromise
	])

	const lists = data as List[]
	const list = lists[0]

	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 px-3 max-md:gap-2">
			<Card>
				<CardHeader>
					<CardTitle>Import Item</CardTitle>
					<CardDescription>
						The item that you are trying to import should be prepopulated below. Just click the &quot;import&quot; ⬇️ button to fetch
						additional information.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Suspense>
						<ImportUrlClient lists={lists} list={list} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
