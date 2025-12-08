import { Suspense } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FallbackRowsMultiple } from '@/components/common/Fallbacks'
import PurchaseSummary from '@/components/me/PurchaseSummary'
import { faShoppingBag } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'

export default async function PurchaseSummaryPage() {
	return (
		<div className="wish-page">
			<div className="relative flex flex-col flex-wrap justify-between gap-2">
				<h1 className="flex flex-row items-center gap-2">Purchase Summary</h1>
				<FontAwesomeIcon icon={faShoppingBag} className="text-[80px] opacity-50 absolute left-4 -top-5 -z-10 text-green-700" />
				<div className="text-sm leading-tight text-muted-foreground">
					This page summarizes your purchases and addons for a given timeframe.
				</div>
				<Suspense fallback={<FallbackRowsMultiple />}>
					<PurchaseSummary />
				</Suspense>
			</div>
		</div>
	)
}
