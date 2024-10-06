'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
			<Link href="/settings/connections" className={pathname === '/settings/connections' ? activeClasses : ''}>
				Connections
			</Link>
			<Link href="/settings/purchases" className={pathname === '/settings/purchases' ? activeClasses : ''}>
				Purchases
			</Link>
		</>
	)
}
