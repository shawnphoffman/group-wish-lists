import { Suspense } from 'react'

import { FallbackRowThick } from '@/components/common/Fallbacks'
import MyPurchases from '@/components/me/MyPurchases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page() {
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Purchases</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<FallbackRowThick />}>
						<MyPurchases />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
