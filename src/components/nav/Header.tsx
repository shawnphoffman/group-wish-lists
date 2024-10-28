import { Suspense } from 'react'
import { faGift } from '@awesome.me/kit-ac8ad9255a/icons/sharp/regular'
import { faCog, faLock } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
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
								My Lists
							</Link>
						</Button>

						<Button size="sm" variant={'outline'} asChild>
							<Link href={`/import`} className="transition-colors" prefetch scroll={false}>
								Quick Add
							</Link>
						</Button>

						<Button size="sm" variant={'outline'} asChild className="px-2">
							<Link href="/settings" className="transition-colors" prefetch={false} title="Settings">
								<FontAwesomeIcon size="lg" icon={faCog} />
							</Link>
						</Button>

						{!isDeployed && (
							<Button size="sm" variant={'outline'} asChild className="hidden px-2 sm:flex">
								<Link href="/admin/invite" className="transition-colors" title="Invite" prefetch={false}>
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
