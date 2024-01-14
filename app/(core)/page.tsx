import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { FallbackRow } from '@/components/icons/Fallback'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import GroupedLists from '@/components/lists/GroupedLists'

const CreateListModal = dynamic(() => import('@/components/modals/CreateListModal'), { ssr: false })

export default async function Lists() {
	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
				<div className="flex flex-col flex-1 gap-6">
					{/* <div className="flex flex-col justify-between xs:flex-row"> */}
					<div className="flex flex-row justify-between">
						<h1>Wish Lists</h1>
						{/* <button type="button" className="mt-4 nav-btn green xs:mt-0" data-hs-overlay="#hs-create-list-modal"> */}
						<button type="button" className="mt-0 nav-btn green" data-hs-overlay="#hs-create-list-modal">
							<FontAwesomeIcon className="fa-sharp fa-solid fa-plus" />
							Create List
						</button>
					</div>
					<Suspense fallback={<FallbackRow label="Loading..." />}>
						<GroupedLists />
					</Suspense>
				</div>
			</div>
			<CreateListModal />
		</>
	)
}
