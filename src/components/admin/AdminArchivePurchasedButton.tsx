'use client'
import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { adminArchiveCompletedItems } from '@/app/(core)/admin/actions'
import { BroomIcon } from '@/components/icons/Icons'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { MenubarShortcut } from '@/components/ui/menubar'

import { Button } from '../ui/button'

export default function AdminArchivePurchasedButton() {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		const resp = await adminArchiveCompletedItems()
		if (resp?.status === 'success') {
			startTransition(() => {
				router.refresh()
			})
		}
	}, [router])

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" className="gap-2">
					Archive All Purchased
					<BroomIcon />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>Do you want to archive all purchased items? This action cannot be undone.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction type="button" onClick={handleClick}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
