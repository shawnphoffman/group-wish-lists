'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { deleteItem } from '@/app/actions/items'

import { DeleteIcon, EditIcon, OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemImage from '@/components/items/components/ItemImage'
import EditItemForm from '@/components/items/forms/EditItemForm'
import { ListItem } from '@/components/types'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'

type Props = {
	item: ListItem
}

export default function ItemRowEditable({ item }: Props) {
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
		<div className={`list-item ${pending && 'pending'} ${isEditing && 'editing'}`}>
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
							{item.notes && <div className="text-sm text-gray-400 whitespace-pre-line">{item.notes}</div>}
						</div>
						{/* Image */}
						<ItemImage url={item.image_url} className="w-24" />
						{/* Actions */}
						<fieldset
							disabled={pending}
							className="flex flex-row items-center self-end justify-end gap-4 md:self-auto md:gap-2 md:flex-col"
						>
							{/* {item.url && (
								<Link
									href={item.url}
									target="_blank"
									referrerPolicy="no-referrer"
									className={`nav-btn max-sm:!text-2xl max-md:!text-xl teal`}
								>
									<OpenUrlIcon includeColor={false} />
								</Link>
							)} */}
							<button type="button" onClick={handleEditClick} className={`nav-btn max-sm:!text-2xl max-md:!text-xl yellow`}>
								<EditIcon includeColor={false} />
							</button>
							{/* <button type="button" onClick={handleDeleteClick} className={`btn-ringed max-sm:!text-2xl max-md:!text-xl red`}>
								<DeleteIcon includeColor={false} />
							</button> */}
						</fieldset>
					</div>
				</div>

				{isEditing && (
					<>
						<hr className="" />

						<div className="flex flex-col items-stretch gap-2 p-2">
							<h5>Actions</h5>
							<div className="flex flex-row gap-2">
								<button type="button" onClick={handleDeleteClick} className="nav-btn red">
									<DeleteIcon includeColor={false} />
									Delete
								</button>
								<button type="button" className="nav-btn yellow">
									<FontAwesomeIcon className="fa-sharp fa-solid fa-right-long-to-line" />
									Move
								</button>
								<button type="button" className="nav-btn teal">
									<OpenUrlIcon includeColor={false} />
									Open URL
								</button>
							</div>
						</div>
						<hr className="border-gray-200 dark:border-gray-700" />
						<EditItemForm listId={item.list_id} item={item} />
					</>
				)}
			</div>
		</div>
	)
}
