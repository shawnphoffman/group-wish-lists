import { Suspense } from 'react'

import { getMyLists } from '@/app/actions/lists'
import ImportUrlClient from '@/components/imports/ImportUrlClient'
import { ListType } from '@/components/me/MyLists'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ImportItem() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const [{ data: myLists }, { data: sharedLists }] = await Promise.all([
		getMyLists(),
		getMyLists(ListType.SHARED_WITH_ME),
		// fakePromise
	])

	const lists = [...(myLists || []), ...(sharedLists || [])].sort((a, b) => b.name.localeCompare(a.name))
	const list = lists[0]

	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 sm:px-3 max-md:gap-2 animate-page-in">
			<Card className="bg-accent">
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
