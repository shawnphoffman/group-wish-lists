'use client'

import { usePathname } from 'next/navigation'
import { IStaticMethods } from 'preline/preline'
import { useEffect } from 'react'

declare global {
	interface Window {
		HSStaticMethods: IStaticMethods
		HSOverlay: {
			close: (selector: string) => void
		}
	}
}

function initPreline(times = 0) {
	setTimeout(
		() => {
			try {
				console.log('initPreline', { times })
				window.HSStaticMethods?.autoInit()
			} catch (error) {
				if (times <= 5) {
					initPreline(times + 1)
				} else {
					throw error
				}
			}
		},
		100 * (times + 1)
	)
}

export default function PrelineScript() {
	const path = usePathname()

	useEffect(() => {
		import('preline/preline')
	}, [])

	useEffect(() => {
		setTimeout(() => {
			initPreline()
		}, 200)
	}, [path])

	return null
}
