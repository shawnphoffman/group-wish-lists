'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { archiveList, unarchiveList } from '@/app/actions/lists'
import { ArchiveIcon, UnarchiveIcon } from '@/components/icons/Icons'
import { List } from '@/components/types'
import { buttonVariants } from '@/components/ui/button'

type Props = {
	listId: List['id']
	isArchived: boolean
}

export default function ArchiveListButton({ listId, isArchived }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		const resp = isArchived ? await unarchiveList(listId) : await archiveList(listId)
		if (resp?.status === 'success') {
			startTransition(() => {
				router.refresh()
			})
		}
	}, [isArchived, listId, router])

	return isArchived ? (
		<button
			className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} gap-1`}
			title="Restore List"
			onClick={handleClick}
			disabled={isPending}
		>
			<UnarchiveIcon />
			Restore
		</button>
	) : (
		<button
			className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} gap-1`}
			title="Archive List"
			onClick={handleClick}
			disabled={isPending}
		>
			<ArchiveIcon />
			Archive
		</button>
	)
}
