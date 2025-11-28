import { Suspense } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FallbackRowsMultiple } from '@/components/common/Fallbacks'
import MyPurchases from '@/components/me/MyPurchases'
import { faShoppingBag } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'

export default async function PurchasesPage() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-5xl px-2 animate-page-in">
			<div className="relative flex flex-col flex-wrap justify-between gap-2">
				<h1 className="flex flex-row items-center gap-2">My Purchases</h1>
				<FontAwesomeIcon icon={faShoppingBag} className="text-[80px] opacity-50 absolute left-4 -top-5 -z-10 text-green-700" />
				<div className="text-sm leading-tight text-muted-foreground">
					{/* This page is a special request because Madison treats this like a social media site... */}
				</div>
				<Suspense fallback={<FallbackRowsMultiple />}>
					<MyPurchases />
				</Suspense>
			</div>
		</div>
	)
}
