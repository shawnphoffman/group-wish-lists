'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { renameList } from '@/app/actions/lists'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

const inputClasses = `px-4 py-2 block w-full border border-gray-200 rounded-lg text-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 autoFocus`

export default function RenameListButton({ listId, name }: any) {
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
				<form action={formAction} className="flex flex-row gap-4">
					<input type="hidden" value={listId} name="id" />
					<input className={inputClasses} type="text" defaultValue={name} name="list-name" autoFocus />
					<button title="Save" className="text-2xl text-green-300 hover:text-green-400" disabled={isPending}>
						<FontAwesomeIcon className="fa-sharp fa-solid fa-check" />
					</button>
					<button
						type="button"
						title="Cancel"
						className="text-2xl text-red-300 hover:text-red-400"
						onClick={handleClick}
						disabled={isPending}
					>
						<FontAwesomeIcon className="fa-sharp fa-solid fa-xmark" />
					</button>
				</form>
			) : (
				<>
					<h1 className="">{name}</h1>
					<button
						type="button"
						title="Rename"
						className="text-2xl text-yellow-200 hover:text-yellow-300"
						onClick={handleClick}
						disabled={isPending}
					>
						<FontAwesomeIcon className="fa-sharp fa-solid fa-pencil" />
					</button>
				</>
			)}
		</>
	)
}
