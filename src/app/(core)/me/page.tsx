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
						{/* Lists */}
						<Suspense fallback={<FallbackRow />}>
							<MyLists />
						</Suspense>
						<Suspense fallback={<FallbackRow />}>
							<div className="flex flex-col gap-3">
								<h3>Shared with Me</h3>
								<MyLists type="shared_with_me" />
							</div>
						</Suspense>
						{/* Lists */}
						<Suspense fallback={<FallbackRow />}>
							<div className="flex flex-col gap-3">
								<h3>Shared with Others</h3>
								<MyLists type="shared_with_others" />
							</div>
						</Suspense>
					</div>
				</main>
			</div>
			{show && <CreateListModal />}
		</>
	)
}
