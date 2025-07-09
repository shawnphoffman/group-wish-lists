'use client'

import { faSharpSolidGiftCircleArrowLeft, faSharpSolidGiftCircleArrowRight } from '@awesome.me/kit-ac8ad9255a/icons/kit/custom'
import { faLock, faRightFromBracket } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import { signOut } from '@/app/actions/auth'
import AdminSettingsLink from '@/components/admin/AdminSettingsLink'
import { Separator } from '@/components/ui/separator'
import { isDeployed } from '@/utils/environment'

export default function SettingsLinks() {
	const pathname = usePathname()

	const passiveClasses = ''
	const activeClasses = 'font-semibold text-primary'

	return (
		<>
			<Link href="/settings" className={pathname === '/settings' ? activeClasses : ''}>
				Profile
			</Link>
			<Link href="/settings/security" className={pathname === '/settings/security' ? activeClasses : ''}>
				Security
			</Link>
			<Link href="/settings/permissions" className={pathname === '/settings/permissions' ? activeClasses : ''}>
				Permissions
			</Link>
			<Link href="/settings/connections" className={pathname === '/settings/connections' ? activeClasses : ''}>
				Connections
			</Link>
			<Separator />
			<Link
				href="/settings/purchases"
				className={twMerge(pathname === '/settings/purchases' ? activeClasses : '', passiveClasses, 'flex flex-row items-center gap-1')}
			>
				<FontAwesomeIcon size="sm" icon={faSharpSolidGiftCircleArrowRight} />
				Purchases
			</Link>
			<Link
				href="/settings/received"
				className={twMerge(pathname === '/settings/received' ? activeClasses : '', passiveClasses, 'flex flex-row items-center gap-1')}
			>
				<FontAwesomeIcon size="sm" icon={faSharpSolidGiftCircleArrowLeft} />
				Received Gifts
			</Link>
			<Separator />
			<Link href="#" onClick={signOut} className="flex flex-row items-center gap-1">
				<FontAwesomeIcon size="sm" icon={faRightFromBracket} />
				Logout
			</Link>
		</>
	)
}
