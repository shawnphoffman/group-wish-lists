import { Suspense } from 'react'

import { FallbackRowThick } from '@/components/common/Fallbacks'
import MyLists from '@/components/me/MyLists'
import NewListButton from '@/components/me/NewListButton'

export default async function MyStuff() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl xs:px-2 animate-page-in">
			<main className="flex flex-col flex-1 gap-8 divide-y">
				{/* LISTS */}
				<div className="flex flex-col gap-6">
					{/* Header */}
					<div className="flex flex-row flex-wrap justify-between">
						<h1 className="whitespace-nowrap">My Lists</h1>

						<div className="flex flex-row flex-wrap justify-end flex-1 gap-0.5 items-center md:justify-end shrink-0">
							<NewListButton />
						</div>
					</div>
					{/* PUBLIC LISTS */}
					<Suspense fallback={<FallbackRowThick />}>
						<MyLists type="public" />
					</Suspense>

					{/* PRIVATE LISTS */}
					<div className="flex flex-col gap-3">
						<h3>My Private Lists</h3>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type="private" />
						</Suspense>
					</div>

					{/* SHARED WITH ME LISTS */}
					<div className="flex flex-col gap-3">
						<h3>Lists I Can Edit</h3>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type="shared_with_me" />
						</Suspense>
					</div>

					{/* SHARED LISTS */}
					<div className="flex flex-col gap-3">
						<h3>My List Editors</h3>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type="shared_with_others" />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
