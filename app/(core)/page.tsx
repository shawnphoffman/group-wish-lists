import { Suspense } from 'react'

import { FallbackRow } from '@/components/icons/Fallback'
import GroupedLists from '@/components/lists/GroupedLists'

export default async function Lists() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
			<div className="flex flex-col flex-1 gap-6">
				<h1>Wish Lists</h1>

				<Suspense fallback={<FallbackRow label="Loading..." />}>
					<GroupedLists />
				</Suspense>
			</div>
		</div>
	)
}
