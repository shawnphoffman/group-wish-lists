import { Suspense } from 'react'
import { faRadio } from '@awesome.me/kit-f973af7de0/icons/duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FallbackRowsMultiple } from '@/components/common/Fallbacks'
import RecentItems from '@/components/items/RecentItems'
import RealTimeListener from '@/components/utils/RealTimeListener'

export default async function RecentItemsPage() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="wish-page">
			<div className="relative flex flex-col flex-wrap justify-between gap-2">
				<h1 className="flex flex-row items-center gap-2">Recent Items</h1>
				<FontAwesomeIcon icon={faRadio} className="text-[80px] opacity-50 absolute left-4 -top-5 -z-10 text-orange-500" />
				<div className="text-sm leading-tight text-muted-foreground">
					These items are the most recently updated public items. Your items are not included.
				</div>
				<Suspense fallback={<FallbackRowsMultiple />}>
					<RecentItems />
				</Suspense>
			</div>

			<RealTimeListener />
		</div>
	)
}
