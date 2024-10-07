'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import { faCheck, faPencil, faXmark } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { renameList } from '@/app/actions/lists'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import { List } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
				<form action={formAction} className="flex flex-row gap-1 max-sm:flex-wrap">
					<input type="hidden" value={listId} name="id" />
					<Input type="text" defaultValue={name} name="list-name" className="w-full" autoFocus />
					<Select name="list-type" defaultValue={type}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(ListCategory).map(([key, value]) => (
								<SelectItem key={key} value={value}>
									<ListTypeIcon type={value} className="mr-1 text-sm" />
									{key}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button title="Save" className="text-2xl" disabled={isPending}>
						<FontAwesomeIcon icon={faCheck} />
					</Button>
					<Button type="button" variant={'outline'} title="Cancel" className="text-2xl" onClick={handleClick} disabled={isPending}>
						<FontAwesomeIcon icon={faXmark} />
					</Button>
				</form>
			) : (
				<div className="relative flex flex-row items-center gap-1">
					<h1 className="w-fit">{name}</h1>
					<ListTypeIcon type={type} className="text-[80px] opacity-25 absolute left-4 -top-5 -z-10" />
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
