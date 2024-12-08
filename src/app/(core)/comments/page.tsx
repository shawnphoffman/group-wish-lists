import { Suspense } from 'react'
import { faGrapes } from '@awesome.me/kit-ac8ad9255a/icons/duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import CommentsByItem from '@/components/comments/CommentsByItem'
import { FallbackRowsMultiple } from '@/components/common/Fallbacks'

export default async function Comments() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl xs:px-2 animate-page-in">
			<div className="flex flex-col flex-1 gap-6">
				<h1 className="flex flex-row items-center w-full gap-2">
					{/* @ts-ignore */}
					<FontAwesomeIcon icon={faGrapes} className="text-purple-500" style={{ '--fa-secondary-color': 'lime' }} />
					<span>Grapevine</span>
				</h1>
				<div className="text-sm leading-tight text-muted-foreground">
					This page is a work-in-progress because Madison treats this like a social media site...
				</div>
				<Suspense fallback={<FallbackRowsMultiple />}>
					<CommentsByItem />
				</Suspense>
			</div>
		</div>
	)
}
