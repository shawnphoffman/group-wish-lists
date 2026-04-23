'use client'

import { DownloadIcon } from 'lucide-react'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'

export default function AdminExportButton() {
	const handleClick = useCallback(() => {
		window.location.assign('/api/admin/export')
	}, [])

	return (
		<Button onClick={handleClick} variant="outline" className="gap-2 group">
			<DownloadIcon className="text-emerald-500 transition-colors group-hover:text-emerald-600 dark:text-emerald-400 dark:group-hover:text-emerald-300" />
			Export All Data
		</Button>
	)
}
