import { Suspense } from 'react'

import { FallbackRowThick } from '@/components/common/Fallbacks'
import MyReceived from '@/components/me/MyReceived'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page() {
	return (
		<div className="grid gap-6 animate-in">
			<Card>
				<CardHeader>
					<CardTitle>Gifts Received</CardTitle>
					<CardDescription>
						Things will only appear here after you have archived purchased items on a list. This prevents you from seeing spoilers leading
						up to an event.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
					<Suspense fallback={<FallbackRowThick />}>
						<MyReceived />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
