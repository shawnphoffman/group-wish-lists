import { Suspense } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import ClientWrapper from './ClientWrapper'

export default async function ImportItem() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

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
						<ClientWrapper />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
