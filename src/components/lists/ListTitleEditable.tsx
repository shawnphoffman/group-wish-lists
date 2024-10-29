'use client'

import { useEffect, useState, useTransition } from 'react'
import { faCheck, faPencil, faXmark } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { renameList } from '@/app/actions/lists'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import { List } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useResettableActionState } from '@/hooks/useResettableActionState'
import { ListCategory } from '@/utils/enums'

import { LockIcon, ShareIcon } from '../icons/Icons'
import { Textarea } from '../ui/textarea'

type Props = {
	listId: List['id']
	name: List['name']
	type: List['type']
	private: List['private']
	shared: boolean
	description: List['description']
}

export default function ListTitleEditable({ listId, name, type, private: isPrivate, description, shared: isShared }: Props) {
	const [state, formAction, pending, reset] = useResettableActionState(renameList, {})
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		if (state?.status === 'success') {
			// console.log('rename.state', state)
			startTransition(() => {
				setIsEditing(false)
				router.refresh()
				reset()
			})
		}
	}, [isEditing, reset, router, state])

	if (isEditing)
		return (
			<form action={formAction} className="flex flex-row w-full gap-2 max-sm:flex-wrap">
				<input type="hidden" value={listId} name="id" />
				<div className="flex flex-col w-full gap-2">
					<Input type="text" defaultValue={name} name="list-name" className="w-full" autoFocus />
					<div className="flex flex-row gap-2">
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
						<Select name="list-privacy" defaultValue={isPrivate ? 'private' : 'public'}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={'private'}>Private</SelectItem>
								<SelectItem value={'public'}>Public</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Textarea name="list-description" defaultValue={description} placeholder="Description" />
				</div>
				<Button type="submit" title="Save" className="text-2xl" disabled={isPending || pending}>
					<FontAwesomeIcon icon={faCheck} />
				</Button>
				<Button
					type="button"
					variant={'outline'}
					title="Cancel"
					className="text-2xl"
					onClick={() => {
						console.log('cancel')
						setIsEditing(false)
					}}
					disabled={isPending || pending}
				>
					<FontAwesomeIcon icon={faXmark} />
				</Button>
			</form>
		)

	return (
		<div className="relative flex flex-row items-center gap-1">
			<h1 className="w-fit">{name}</h1>
			<div className="text-[60px] sm:text-[80px] opacity-25 absolute left-4 -top-2 sm:-top-5 -z-10 flex flex-row gap-4">
				<ListTypeIcon type={type} className="text-[60px] sm:text-[80px]" />
				{isPrivate && <LockIcon fade={false} />}
				{isShared && <ShareIcon />}
			</div>
			<Button
				variant="ghost"
				type="button"
				title="Rename"
				className="text-2xl text-yellow-300 transition-all hover:text-yellow-400"
				onClick={() => setIsEditing(true)}
				disabled={isPending || pending}
			>
				<FontAwesomeIcon icon={faPencil} />
			</Button>
		</div>
	)
}
