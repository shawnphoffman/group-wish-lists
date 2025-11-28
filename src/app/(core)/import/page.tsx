import { Suspense } from 'react'
import { faCirclePlus } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

import ClientWrapper from './ClientWrapper'

export default async function ImportItem() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	return (
		<div className="relative flex flex-col flex-1 w-full max-w-5xl gap-6 px-2 max-md:gap-2 animate-page-in">
			<div className="relative flex flex-col flex-1 gap-6">
				<h1 className="flex flex-row items-center gap-2">Import Item</h1>
				<FontAwesomeIcon icon={faCirclePlus} className="text-[80px] opacity-50 absolute left-4 -top-5 -z-10 text-blue-500" />
				<Card className="bg-accent">
					<CardHeader>
						{/* <CardTitle>Import Item</CardTitle> */}
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
		</div>
	)
}
