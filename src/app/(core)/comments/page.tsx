import { Suspense } from 'react'
import { faGrapes } from '@awesome.me/kit-ac8ad9255a/icons/duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import CommentsByItem from '@/components/comments/CommentsByItem'
import { FallbackRowsMultiple } from '@/components/common/Fallbacks'

export default async function Comments() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-5xl xs:px-2 animate-page-in">
			<div className="relative flex flex-col flex-wrap justify-between gap-2">
				<h1 className="flex flex-row items-center gap-2">Grapevine</h1>
				<FontAwesomeIcon
					icon={faGrapes}
					className="text-[80px] opacity-50 absolute left-4 -top-5 -z-10 text-fuchsia-700"
					// @ts-ignore
					style={{ '--fa-secondary-color': 'lime' }}
				/>

				<div className="text-sm leading-tight text-muted-foreground">
					This page is a special request because Madison treats this like a social media site...
				</div>
				<Suspense fallback={<FallbackRowsMultiple />}>
					<CommentsByItem />
				</Suspense>
			</div>
		</div>
	)
}
