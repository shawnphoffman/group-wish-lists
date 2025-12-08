import { Suspense } from 'react'
import { faListCheck } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FallbackRowsMultiple } from '@/components/common/Fallbacks'
import ListsByUser from '@/components/lists/ListsByUser'

export default async function Lists() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="wish-page">
			<div className="relative flex flex-col flex-1 gap-6">
				<h1 className="flex flex-row items-center gap-2">Wish Lists</h1>
				<FontAwesomeIcon icon={faListCheck} className="text-[80px] opacity-50 absolute left-4 -top-5 -z-10 text-red-500" />
				<Suspense fallback={<FallbackRowsMultiple />}>
					<ListsByUser />
				</Suspense>
			</div>
		</div>
	)
}
