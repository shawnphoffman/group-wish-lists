'use client'
import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { archiveCompletedItems } from '@/app/actions/items'
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

export default function ArchivePurchasedButton({ listId }: any) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		const resp = await archiveCompletedItems(listId)
		if (resp?.status === 'success') {
			startTransition(() => {
				router.refresh()
			})
		}
	}, [listId, router])

	return (
		<AlertDialog>
			<AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
				Archive Purchased
				<MenubarShortcut>
					<BroomIcon />
				</MenubarShortcut>
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
