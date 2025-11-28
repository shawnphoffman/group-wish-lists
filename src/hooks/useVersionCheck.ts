'use client'

import { useEffect, useRef } from 'react'

interface VersionCheckOptions {
	/** Interval in milliseconds to check for version updates (default: 60000 = 1 minute) */
	interval?: number
	/** Whether to enable version checking (default: true in production) */
	enabled?: boolean
}

/**
 * Hook that periodically checks for new deployments and refreshes the page when detected.
 * Only runs in production environments.
 */
export function useVersionCheck(options: VersionCheckOptions = {}) {
	const { interval = 60000 * 5, enabled = process.env.NODE_ENV === 'production' } = options
	const currentVersionRef = useRef<string | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (!enabled) return

		const checkVersion = async () => {
			try {
				const response = await fetch('/api/version', {
					cache: 'no-store',
					headers: {
						'Cache-Control': 'no-cache',
					},
				})

				if (!response.ok) {
					console.log('Version check failed:', response.statusText)
					return
				}

				const data = await response.json()
				const newVersion = data.version

				if (currentVersionRef.current === null) {
					// First check - store the current version
					console.log('First check - storing current version:', newVersion)
					currentVersionRef.current = newVersion
				} else if (currentVersionRef.current !== newVersion) {
					// Version changed - refresh the page
					window.location.reload()
				}
			} catch (error) {
				// Silently fail - don't interrupt user experience
				console.debug('Version check failed:', error)
			}
		}

		// Initial check after a short delay
		const initialTimeout = setTimeout(() => {
			console.log('Initial check - starting version check')
			checkVersion()
		}, 2000)

		// Set up periodic checks
		intervalRef.current = setInterval(checkVersion, interval)

		return () => {
			clearTimeout(initialTimeout)
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [interval, enabled])
}
