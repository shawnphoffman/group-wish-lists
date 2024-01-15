'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { renameList } from '@/app/actions/lists'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import { ListCategory } from '@/utils/enums'

import TypeIcon from '../icons/TypeIcon'
import { List } from './types'

type Props = {
	listId: List['id']
	name: List['name']
	type: List['type']
}

export default function EditableListTitle({ listId, name, type }: Props) {
	const [state, formAction] = useFormState(renameList, {})
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	useEffect(() => {
		if (state?.status === 'success') {
			console.log('rename.state', state)
			startTransition(() => {
				setIsEditing(() => !isEditing)
				router.refresh()
			})
		}
	}, [state])

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
						<FontAwesomeIcon className="fa-sharp fa-solid fa-check" />
					</button>
					<button type="button" title="Cancel" className="text-2xl nav-btn red" onClick={handleClick} disabled={isPending}>
						<FontAwesomeIcon className="fa-sharp fa-solid fa-xmark" />
					</button>
				</form>
			) : (
				<>
					<TypeIcon type={type} className="text-3xl" />
					<h1>{name}</h1>
					<button type="button" title="Rename" className="text-2xl nav-btn yellow " onClick={handleClick} disabled={isPending}>
						<FontAwesomeIcon className="fa-sharp fa-solid fa-pencil" />
					</button>
				</>
			)}
		</>
	)
}
