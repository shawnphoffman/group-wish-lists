import { Suspense } from 'react'
import { faPlus } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import FallbackRow from '@/components/common/Fallbacks'
import CreateListModal from '@/components/me/CreateListModal'
import MyLists from '@/components/me/MyLists'
import MyPurchases from '@/components/me/MyPurchases'
import { buttonVariants } from '@/components/ui/button'

import MeClient from './MeClient'

type Props = {
	searchParams: Record<string, string> | null | undefined
}

export default async function MyStuff({ searchParams }: Props) {
	const show = searchParams?.show
	return (
		<>
			{/* <div className="flex flex-col flex-1 w-full max-w-2xl px-3 "> */}
			<div className="flex flex-col flex-1 w-full max-w-4xl px-2 ">
				<main className="flex flex-col flex-1 gap-8 divide-y">
					{/* LISTS */}
					<div className="flex flex-col gap-6">
						{/* Header */}
						<div className="flex flex-row justify-between">
							<h1>My Lists</h1>
							<Link href="/me?show=true" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
								<FontAwesomeIcon icon={faPlus} className="mr-1" />
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

					<Suspense fallback={null}>
						<MeClient />
					</Suspense>

					{/* LISTS */}
					<div className="flex flex-col gap-3 pt-6">
						{/* Header */}
						<div className="flex flex-row justify-between">
							<h1>My Purchases</h1>
						</div>
						{/* Lists */}
						<Suspense fallback={<FallbackRow />}>
							<MyPurchases />
						</Suspense>
					</div>
				</main>
			</div>
			{show && <CreateListModal />}
		</>
	)
}
