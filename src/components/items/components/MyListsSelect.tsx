'use client'

import { startTransition, useCallback, useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/navigation'

import { moveItem } from '@/app/actions/items'
import { LockIcon, MoveIcon } from '@/components/icons/Icons'
import { List, ListItem } from '@/components/types'

type Props = {
	id: ListItem['id']
	listId: List['id']
	lists: List[]
}

export default function MyListsSelect({ lists, id, listId }: Props) {
	const [loading, setLoading] = useState(false)
	const [list, setList] = useState<List | null>(null)
	const router = useRouter()

	const handleMoveItem = useCallback(async () => {
		if (!list) return
		setLoading(true)
		const resp = await moveItem(id, list?.id)
		if (resp.status === 'success') {
			startTransition(() => {
				setLoading(false)
				router.refresh()
			})
		}
	}, [id, list, router])

	useEffect(() => {
		const currentList = lists.find((list: List) => list.id === listId)
		setList(currentList || null)
	}, [listId, lists])

	if (!lists || !list) {
		return null
	}

	return (
		<fieldset className="flex flex-col items-center gap-2 pt-2 sm:flex-row !leading-none" disabled={loading}>
			<RadioGroup value={list} onChange={setList} className="items-start flex flex-col gap-0.5 text-left flex-1 w-full">
				{lists.map(list => (
					<RadioGroup.Option value={list} key={list.id} className={'grid'}>
						{({ checked }) => (
							<label className={`flex nav-btn text-sm flex-1 py-1 truncate w-full gap-1 text-left ${checked ? 'purple' : 'gray'}`}>
								{list.name}
								{list?.private && <LockIcon fixedWidth className="text-xs" />}
							</label>
						)}
					</RadioGroup.Option>
				))}
			</RadioGroup>
			<button type="button" disabled={listId === list.id} onClick={handleMoveItem} className="text-xs btn purple">
				<MoveIcon />
				Move Item
			</button>
		</fieldset>
	)
}
