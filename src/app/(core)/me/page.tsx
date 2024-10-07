import { Suspense } from 'react'

import FallbackRow from '@/components/common/Fallbacks'
import MyLists from '@/components/me/MyLists'
import NewListButton from '@/components/me/NewListButton'

export default async function MyStuff() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-2 ">
			<main className="flex flex-col flex-1 gap-8 divide-y">
				{/* LISTS */}
				<div className="flex flex-col gap-6">
					{/* Header */}
					<div className="flex flex-row justify-between">
						<h1>My Lists</h1>

						<div className="flex flex-row flex-wrap justify-end flex-1 gap-0.5 items-center md:justify-end shrink-0">
							<NewListButton />
						</div>
					</div>
					{/* PUBLIC LISTS */}
					<Suspense fallback={<FallbackRow />}>
						<MyLists />
					</Suspense>

					{/* PRIVATE LISTS */}
					<div className="flex flex-col gap-3">
						<h3>My Private Lists</h3>
						<Suspense fallback={<FallbackRow />}>
							<MyLists type="private" />
						</Suspense>
					</div>

					{/* SHARED WITH ME LISTS */}
					<div className="flex flex-col gap-3">
						<h3>Lists I Can Edit</h3>
						<Suspense fallback={<FallbackRow />}>
							<MyLists type="shared_with_me" />
						</Suspense>
					</div>

					{/* SHARED LISTS */}
					<div className="flex flex-col gap-3">
						<h3>My List Editors</h3>
						<Suspense fallback={<FallbackRow />}>
							<MyLists type="shared_with_others" />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
