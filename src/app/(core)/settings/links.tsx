'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SettingsLinks() {
	const pathname = usePathname()

	const activeClasses = 'font-semibold text-primary'

	return (
		<>
			<Link href="/settings" className={pathname === '/settings' ? activeClasses : ''}>
				General
			</Link>
			<Link href="/settings/security" className={pathname === '/settings/security' ? activeClasses : ''}>
				Security
			</Link>
			<Link href="/settings/purchases" className={pathname === '/settings/purchases' ? activeClasses : ''}>
				Purchases
			</Link>
			{/* <Link href="#">Integrations</Link>
			<Link href="#">Support</Link>
			<Link href="#">Organizations</Link>
			<Link href="#">Advanced</Link> */}
		</>
	)
}
