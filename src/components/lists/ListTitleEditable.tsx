'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import { faPencil, faXmark } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { faCheck } from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { renameList } from '@/app/actions/lists'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import { List } from '@/components/types'
import { Button } from '@/components/ui/button'
import { ListCategory } from '@/utils/enums'

type Props = {
	listId: List['id']
	name: List['name']
	type: List['type']
}

export default function ListTitleEditable({ listId, name, type }: Props) {
	const [state, formAction] = useFormState(renameList, {})
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	useEffect(() => {
		if (state?.status === 'success') {
			// console.log('rename.state', state)
			startTransition(() => {
				setIsEditing(() => !isEditing)
				router.refresh()
			})
		}
	}, [isEditing, router, state])

	return (
		<>
			{isEditing ? (
				<form action={formAction} className="flex flex-row gap-1">
					<input type="hidden" value={listId} name="id" />
					<input className="input" type="text" defaultValue={name} name="list-name" autoFocus />
					<select name="list-type" className="w-40 select" defaultValue={type}>
						{Object.entries(ListCategory).map(([key, value]) => (
							<option key={key} value={value}>
								{key}
							</option>
						))}
					</select>
					<button title="Save" className="text-2xl nav-btn green" disabled={isPending}>
						<FontAwesomeIcon icon={faCheck} />
					</button>
					<button type="button" title="Cancel" className="text-2xl nav-btn red" onClick={handleClick} disabled={isPending}>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</form>
			) : (
				<div className="flex flex-row items-center gap-1">
					<ListTypeIcon type={type} className="text-3xl" />
					<h1 className="w-fit">{name}</h1>
					<Button
						variant="ghost"
						type="button"
						title="Rename"
						className="text-2xl text-yellow-300 transition-all hover:text-yellow-400"
						onClick={handleClick}
						disabled={isPending}
					>
						<FontAwesomeIcon icon={faPencil} />
					</Button>
				</div>
			)}
		</>
	)
}
