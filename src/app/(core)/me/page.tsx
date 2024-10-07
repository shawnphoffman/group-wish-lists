import { Suspense } from 'react'
import Link from 'next/link'

import FallbackRow from '@/components/common/Fallbacks'
import { AddIcon } from '@/components/icons/Icons'
import CreateListModal from '@/components/me/CreateListModal'
import MyLists from '@/components/me/MyLists'
import { buttonVariants } from '@/components/ui/button'

type Props = {
	searchParams: Record<string, string> | null | undefined
}

export default async function MyStuff({ searchParams }: Props) {
	const show = searchParams?.show
	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-4xl px-2 ">
				<main className="flex flex-col flex-1 gap-8 divide-y">
					{/* LISTS */}
					<div className="flex flex-col gap-6">
						{/* Header */}
						<div className="flex flex-row justify-between">
							<h1>My Lists</h1>
							<Link href="/me?show=true" className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} gap-1`}>
								<AddIcon />
								New List
							</Link>
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
							<h3>Lists Shared with Me</h3>
							<Suspense fallback={<FallbackRow />}>
								<MyLists type="shared_with_me" />
							</Suspense>
						</div>

						{/* SHARED LISTS */}
						<div className="flex flex-col gap-3">
							<h3>Lists Shared with Others</h3>
							<Suspense fallback={<FallbackRow />}>
								<MyLists type="shared_with_others" />
							</Suspense>
						</div>
					</div>
				</main>
			</div>
			{show && <CreateListModal />}
		</>
	)
}
