import { Suspense } from 'react'

import MyPurchases from '@/components/me/MyPurchases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'

export default async function Page() {
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Purchases</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense fallback={null}>
						<MyPurchases />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
