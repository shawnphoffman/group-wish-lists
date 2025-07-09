import { Suspense } from 'react'
import { faGift } from '@awesome.me/kit-ac8ad9255a/icons/sharp/regular'
import { faComments, faRadio } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { isImpersonating, stopImpersonation } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

import { FallbackButton } from '../common/Fallbacks'

import AuthButton from './AuthButton'
import StopImpersonatingButton from './StopImpersonatingButton'
import UserBadge from './UserBadge'

export default async function Header() {
	let impersonating = await isImpersonating()
	console.log('impersonating user:', impersonating)

	return (
		<header className="sticky top-0 z-20 w-full border-b bg-background animate-page-down">
			<div className="container flex items-center justify-between gap-2 px-0 py-2 sm:px-2">
				<div className="flex items-center gap-2 sm:gap-6">
					<Link href="/" className="flex items-center gap-2 group" prefetch>
						<FontAwesomeIcon icon={faGift} size="lg" className="transition-colors text-destructive group-hover:animate-spin" />
						<span className="hidden text-lg font-bold sm:inline-block">Wish Lists</span>
						<span className="inline-block text-lg font-bold sm:hidden">Lists</span>
					</Link>
					<nav className="flex items-center gap-1">
						{/* */}
						<Button size="sm" variant={'outline'} asChild>
							<Link href="/me" className="transition-colors" prefetch>
								My Lists
							</Link>
						</Button>

						{/* */}
						<Button size="sm" variant={'outline'} asChild>
							<Link href={`/import`} className="transition-colors" prefetch scroll={false}>
								{/* <Link href={`/lists/1/edit#add-item`} className="transition-colors" prefetch scroll={false}> */}
								<span className="hidden xs:inline-block">Quick Add</span>
								<span className="inline-block xs:hidden">Add</span>
							</Link>
						</Button>

						{/*  */}
						<Button size="sm" variant={'outline'} asChild className="px-2">
							<Link
								href="/comments"
								className="text-blue-500 transition-colors hover:text-blue-600 group-hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:group-hover:text-blue-300"
								prefetch={false}
								title="Comments Feed"
							>
								<FontAwesomeIcon size="lg" icon={faComments} />
							</Link>
						</Button>

						{/*  */}
						<Button size="sm" variant={'outline'} asChild className="px-2">
							<Link
								href="/recent"
								className="text-orange-500 transition-colors hover:text-orange-600 group-hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 dark:group-hover:text-orange-300"
								prefetch={false}
								title="Recent Items"
							>
								<FontAwesomeIcon size="lg" icon={faRadio} />
							</Link>
						</Button>
					</nav>
				</div>
				<div className="flex items-center gap-1 sm:gap-1">
					{!!impersonating && <StopImpersonatingButton impersonating={impersonating} />}
					{/*  */}
					<Suspense>
						<Link href="/settings" title="Settings">
							<UserBadge />
						</Link>
					</Suspense>
					{/*  */}
					<Suspense fallback={<FallbackButton />}>
						<AuthButton />
					</Suspense>
				</div>
			</div>
		</header>
	)
}
