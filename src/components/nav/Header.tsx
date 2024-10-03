import { faGift, faLock } from '@awesome.me/kit-ac8ad9255a/icons/sharp/regular'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { isDeployed } from '@/utils/environment'

import { ModeToggle } from '../ModeToggle'

import AuthButton from './AuthButton'
import UserBadge from './UserBadge'

export default function Header() {
	return (
		<header className="w-full border-b bg-background">
			<div className="container flex items-center justify-between gap-2 p-2">
				<div className="flex items-center gap-2 sm:gap-6">
					<Link href="/" className="flex items-center gap-2 group">
						<FontAwesomeIcon icon={faGift} size="lg" className="transition-colors text-primary group-hover:animate-spin" />
						<span className="hidden text-lg font-bold sm:inline-block">Wish Lists</span>
						<span className="inline-block text-lg font-bold sm:hidden">Lists</span>
					</Link>
					<nav className="flex items-center space-x-0.5">
						<Button size="sm" variant={'outline'} asChild>
							<Link href="/me" className="transition-colors">
								My Stuff
							</Link>
						</Button>

						{/* <Link href="/faq" className={'text-xl px-2  hidden sm:inline-block hover:text-secondary transition-colors'} title="FAQ">
							<FontAwesomeIcon fixedWidth icon={faSealQuestion} />
						</Link> */}

						{!isDeployed && (
							<Link
								href="/admin/invite"
								className={'text-xl hidden sm:inline-block px-2 hover:text-secondary transition-colors'}
								title="Invite"
							>
								<FontAwesomeIcon fixedWidth icon={faLock} />
							</Link>
						)}
					</nav>
				</div>
				<div className="flex items-center gap-2 sm:gap-4">
					<UserBadge />
					<ModeToggle />
					<AuthButton />
				</div>
			</div>
		</header>
	)
}
