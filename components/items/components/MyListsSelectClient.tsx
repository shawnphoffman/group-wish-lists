'use client'

import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { startTransition, useCallback, useState } from 'react'

import { moveItem } from '@/app/actions/items'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import { List, ListItem } from '@/components/types'

type Props = {
	lists: List[] | null
	id: ListItem['id']
	listId: List['id']
}

export default function MyListsSelectClient({ id, listId, lists }: Props) {
	const [loading, setLoading] = useState(false)
	const [list, setList] = useState<List | null>()
	const router = useRouter()

	const handleMoveItem = useCallback(async () => {
		if (!list) return
		setLoading(true)
		const resp = await moveItem(id, list?.id)
		if (resp.status === 'success') {
			console.log('REFRESHING')
			startTransition(() => {
				setLoading(false)
				router.refresh()
			})
		}
	}, [list])

	if (!lists || !list) return null

	return (
		<fieldset className="flex flex-row items-center gap-2" disabled={loading}>
			<RadioGroup value={list} onChange={setList}>
				<div className="flex flex-col gap-1">
					{lists.map(list => (
						<RadioGroup.Option value={list} key={list.id}>
							{({ checked }) => <label className={`nav-btn text-sm flex-1 py-1 w-full ${checked ? 'purple' : 'gray'}`}>{list.name}</label>}
						</RadioGroup.Option>
					))}
				</div>
			</RadioGroup>
			<button type="button" disabled={listId === list?.id} onClick={handleMoveItem} className="btn purple">
				<FontAwesomeIcon className="fa-sharp fa-solid fa-right-long-to-line" />
				Move Item
			</button>
		</fieldset>
	)
}
