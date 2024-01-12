'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { deleteItem } from '@/app/actions/items'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'

import ItemImage from '../ItemImage'
import { ListItem } from '../types'
import EditItemForm from './EditItemForm'

type Props = {
	item: ListItem
}

export default function ListItemEditRow({ item }: Props) {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleEditClick = useCallback(() => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	const handleDeleteClick = useCallback(async () => {
		if (window.confirm(`Are you sure you want to delete item "${item.title}"?`)) {
			const resp = await deleteItem(item.id)
			if (resp?.status === 'success') {
				startTransition(() => {
					router.refresh()
				})
			} else {
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

	return (
		<div className="flex flex-row items-stretch gap-x-3.5 gap-y-4 py-2.5 px-4 text-base font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					<div className="flex flex-col items-center justify-center w-4 shrink-0">
						{/* Priority */}
						<ItemPriorityIcon priority={item.priority} />
					</div>
					<div className="flex flex-col items-center flex-1 gap-2 md:flex-row md:gap-4">
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div className="">{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="text-sm text-gray-400">{item.notes}</div>}
						</div>
						{/* Image */}
						<ItemImage url={item.image_url} />
						{/* Actions */}
						<div className="flex flex-row items-center justify-end gap-4 text-xl">
							{item.url && (
								<a href={item.url} target="_blank" referrerPolicy="no-referrer" className="text-teal-300 hover:text-teal-400">
									<FontAwesomeIcon className="fa-sharp fa-solid fa-up-right-from-square" />
								</a>
							)}
							<button type="button" className="text-yellow-200 hover:text-yellow-300" onClick={handleEditClick}>
								<FontAwesomeIcon className="fa-sharp fa-solid fa-pen-to-square" />
							</button>
							<button type="button" className="text-red-300 hover:text-red-400" onClick={handleDeleteClick}>
								<FontAwesomeIcon className="fa-sharp fa-solid fa-trash-xmark" />
							</button>
						</div>
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
