'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Separator } from '@/components/ui/separator'

export default function SettingsLinks() {
	const pathname = usePathname()

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
			<Link href="/settings/purchases" className={pathname === '/settings/purchases' ? activeClasses : ''}>
				Purchases
			</Link>
			<Link href="#">Received (Coming Soon)</Link>
		</>
	)
}
