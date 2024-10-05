'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { archiveList, unarchiveList } from '@/app/actions/lists'
import { ArchiveIcon, UnarchiveIcon } from '@/components/icons/Icons'
import { List } from '@/components/types'
import { MenubarItem, MenubarShortcut } from '@/components/ui/menubar'

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
		<MenubarItem title="Restore List" onClick={handleClick} disabled={isPending}>
			Restore List
			<MenubarShortcut>
				<UnarchiveIcon />
			</MenubarShortcut>
		</MenubarItem>
	) : (
		<MenubarItem title="Archive List" onClick={handleClick} disabled={isPending}>
			Archive List
			<MenubarShortcut>
				<ArchiveIcon />
			</MenubarShortcut>
		</MenubarItem>
	)
}
