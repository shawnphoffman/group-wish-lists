import { Suspense } from 'react'
import { faGift } from '@awesome.me/kit-ac8ad9255a/icons/sharp/regular'
import {
	faCog,
	// faComments,
	faLock,
} from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { isDeployed } from '@/utils/environment'

import { FallbackBadge, FallbackButton } from '../common/Fallbacks'
import { ModeToggle } from '../ModeToggle'

import AuthButton from './AuthButton'
import UserBadge from './UserBadge'

export default async function Header() {
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
						<Button size="sm" variant={'outline'} asChild>
							<Link href="/me" className="transition-colors" prefetch>
								{/* <span className="hidden xs:inline-block"> */}
								My Lists
								{/* </span> */}
								{/* <span className="inline-block xs:hidden">Mine</span> */}
							</Link>
						</Button>

						<Button size="sm" variant={'outline'} asChild>
							<Link href={`/import`} className="transition-colors" prefetch scroll={false}>
								{/* <Link href={`/lists/1/edit#add-item`} className="transition-colors" prefetch scroll={false}> */}

								<span className="hidden xs:inline-block">Quick Add</span>
								<span className="inline-block xs:hidden">Add</span>
							</Link>
						</Button>

						{/* <Button size="sm" variant={'outline'} asChild className="px-2">
							<Link
								href="/comments"
								className="text-blue-500 transition-colors hover:text-blue-600 group-hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:group-hover:text-blue-300"
								prefetch={false}
								title="Comments Feed"
							>
								<FontAwesomeIcon size="lg" icon={faComments} />
							</Link>
						</Button> */}

						<Button size="sm" variant={'outline'} asChild className="px-2">
							<Link
								href="/settings"
								className="text-green-500 transition-colors hover:text-green-600 group-hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 dark:group-hover:text-green-300"
								prefetch={false}
								title="Settings"
							>
								<FontAwesomeIcon size="lg" icon={faCog} />
							</Link>
						</Button>

						{!isDeployed && (
							<Button size="sm" variant={'outline'} asChild className="hidden px-2 sm:flex">
								<Link
									href="/admin"
									className="text-red-500 transition-colors hover:text-red-600 group-hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:group-hover:text-red-300"
									title="Admin"
									prefetch={false}
								>
									<FontAwesomeIcon size="lg" icon={faLock} />
								</Link>
							</Button>
						)}

						{/* <Link href="/faq" className={'text-xl px-2  hidden sm:inline-block hover:text-secondary transition-colors'} title="FAQ">
							<FontAwesomeIcon fixedWidth icon={faSealQuestion} />
						</Link> */}
					</nav>
				</div>
				<div className="flex items-center gap-1 sm:gap-2">
					<Suspense fallback={<FallbackBadge />}>
						<UserBadge />
					</Suspense>
					<ModeToggle />
					<Suspense fallback={<FallbackButton />}>
						<AuthButton />
					</Suspense>
				</div>
			</div>
		</header>
	)
}
