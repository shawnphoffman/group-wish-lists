'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { deleteItem } from '@/app/actions/items'

import ItemPriorityIcon from '@/components/icons/PriorityIcon'

import EditItemForm from './EditItemForm'

export default function ListItemEditRow({ item }: any) {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleEditClick = useCallback(() => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	const handleDeleteClick = useCallback(async () => {
		// // TODO add a confirmation dialog here
		// await deleteItem(item.id)
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
		<div className="flex flex-row items-stretch gap-x-3.5 gap-y-4 py-2.5 px-4 text-base font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
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
						{item.image_url && <img src={item.image_url} alt={item.scrape.result.ogTitle} className="object-scale-down w-24 rounded-lg" />}
						{/* Actions */}
						<div className="flex flex-row items-center justify-end gap-4 text-xl">
							{item.url && (
								<a href={item.url} target="_blank" referrerPolicy="no-referrer" className="text-teal-200 hover:text-teal-300">
									<i className="fa-sharp fa-solid fa-up-right-from-square" aria-hidden />
								</a>
							)}
							<button type="button" className="text-yellow-200 hover:text-yellow-300" onClick={handleEditClick}>
								<i className="fa-sharp fa-solid fa-pen-to-square" aria-hidden />
							</button>
							<button type="button" className="text-red-300 hover:text-red-400" onClick={handleDeleteClick}>
								<i className="fa-sharp fa-solid fa-trash-xmark" aria-hidden />
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
