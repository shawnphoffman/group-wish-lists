'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { deleteItem } from '@/app/actions/items'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import { DeleteIcon, EditIcon, OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'

import ItemImage from '../ItemImage'
import { ListItem } from '../types'
import EditItemForm from './EditItemForm'

type Props = {
	item: ListItem
}

export default function ListItemEditRow({ item }: Props) {
	const [isEditing, setIsEditing] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleEditClick = useCallback(() => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	const handleDeleteClick = useCallback(async () => {
		if (window.confirm(`Are you sure you want to delete item "${item.title}"?`)) {
			setIsDeleting(true)
			const resp = await deleteItem(item.id)
			if (resp?.status === 'success') {
				startTransition(() => {
					setIsDeleting(() => false)
					router.refresh()
				})
			} else {
				setIsDeleting(false)
				console.log('delete error', { resp, item })
			}
		}
	}, [isEditing])

	useEffect(() => {
		if (isEditing) {
			setIsEditing(false)
		}
	}, [item])

	if (!item) return null

	const pending = isPending || isDeleting

	return (
		<div className={`list-item ${pending && 'pending'}`}>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					<div className="flex flex-col items-center justify-center w-4 shrink-0">
						{/* Priority */}
						<ItemPriorityIcon priority={item.priority} />
					</div>
					<div className="flex flex-col items-center flex-1 gap-2 md:flex-row md:gap-4">
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div>{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="text-sm text-gray-400">{item.notes}</div>}
						</div>
						{/* Image */}
						<ItemImage url={item.image_url} />
						{/* Actions */}
						{/* {!isDeleting && ( */}
						<fieldset disabled={pending} className="flex flex-row items-center justify-end gap-4 text-xl">
							{item.url && (
								<Link href={item.url} target="_blank" referrerPolicy="no-referrer">
									<OpenUrlIcon />
								</Link>
							)}
							<button type="button" onClick={handleEditClick}>
								<EditIcon />
							</button>
							<button type="button" onClick={handleDeleteClick}>
								<DeleteIcon />
							</button>
						</fieldset>
						{/* )} */}
					</div>
				</div>

				{isEditing && (
					<>
						<hr className="border-gray-200 dark:border-gray-700" />
						<EditItemForm listId={item.list_id} item={item} />
					</>
				)}
			</div>
		</div>
	)
}
