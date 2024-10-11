import { Suspense } from 'react'

import { FallbackRowsMultiple } from '@/components/common/Fallbacks'
import ListsByUser from '@/components/lists/ListsByUser'

export default async function Lists() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-2 animate-page-in">
			<div className="flex flex-col flex-1 gap-6">
				<h1>Wish Lists</h1>
				<Suspense fallback={<FallbackRowsMultiple />}>
					<ListsByUser />
				</Suspense>
			</div>
		</div>
	)
}
