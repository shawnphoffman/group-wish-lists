'use client'

import { useVersionCheck } from '@/hooks/useVersionCheck'

/**
 * Component that automatically checks for new deployments and refreshes the page.
 * This component renders nothing but runs the version check hook in the background.
 */
export function VersionChecker() {
	useVersionCheck()
	return null
}
