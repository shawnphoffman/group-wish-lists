'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { useSidebar } from '@/components/ui/sidebar'

export function NavigationEvents() {
	const pathname = usePathname()
	const { setOpenMobile, setOpen, isMobile } = useSidebar()

	useEffect(() => {
		if (isMobile) {
			// console.log('closing mobile sidebar')
			setOpenMobile(false)
		} else {
			// console.log('closing desktop sidebar')
			setOpen(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, isMobile])

	return null
}
