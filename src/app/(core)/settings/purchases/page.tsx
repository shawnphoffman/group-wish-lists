import { Suspense } from 'react'
import { faSharpSolidGiftCircleArrowRight } from '@awesome.me/kit-ac8ad9255a/icons/kit/custom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FallbackRowThick } from '@/components/common/Fallbacks'
import MyPurchases from '@/components/me/MyPurchases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page() {
	return (
		<div className="grid gap-6 animate-page-in">
			<Card className="bg-accent">
				<CardHeader>
					<CardTitle>
						<FontAwesomeIcon size="sm" icon={faSharpSolidGiftCircleArrowRight} className="mr-1" />
						Purchases
					</CardTitle>
				</CardHeader>
				<CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
					<Suspense fallback={<FallbackRowThick />}>
						<MyPurchases />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
