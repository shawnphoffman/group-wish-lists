import { Suspense } from 'react'
import { faRadio } from '@awesome.me/kit-ac8ad9255a/icons/duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FallbackRowsMultiple } from '@/components/common/Fallbacks'
import RecentItems from '@/components/items/RecentItems'

export default async function RecentItemsPage() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl xs:px-2 animate-page-in">
			<div className="flex flex-col flex-1 gap-6">
				<h1 className="flex flex-row items-center w-full gap-2">
					<FontAwesomeIcon icon={faRadio} className="text-orange-500" />
					<span>Recent Items</span>
				</h1>
				<div className="text-sm leading-tight text-muted-foreground">These items are the most recent public items added.</div>
				<Suspense fallback={<FallbackRowsMultiple />}>
					<RecentItems />
				</Suspense>
			</div>
		</div>
	)
}
