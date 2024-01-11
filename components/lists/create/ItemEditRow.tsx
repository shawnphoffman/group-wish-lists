'use client'

import { useCallback, useState } from 'react'

import ItemPriorityIcon from '../ItemPriorityIcon'
import AddItemForm from './AddItemForm'

export default function ListItemEditRow({ item }: any) {
	const [isEditing, setIsEditing] = useState(false)

	const handleEditClick = useCallback(() => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	if (!item) return null

	const hasImage = item.scrape?.result?.ogImage?.length > 0

	return (
		<div className="flex flex-row items-stretch gap-x-3.5 gap-y-4 py-2.5 px-4 text-base font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row items-stretch gap-x-3.5">
					<div className="flex flex-col items-center justify-center w-4 shrink-0">
						{/* Priority */}
						<ItemPriorityIcon priority={item.priority} />
					</div>
					<div className="flex flex-col gap-2 md:flex-row md:gap-4 items-center flex-1">
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div className="">{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="text-sm text-gray-400">{item.notes}</div>}
						</div>
						{/* Image */}
						{hasImage && (
							<img src={item.scrape.result.ogImage[0].url} alt={item.scrape.result.ogTitle} className="object-scale-down rounded-lg w-24" />
						)}
						{/* Actions */}
						<div className="flex flex-row gap-4 items-center justify-end text-xl">
							{item.url && (
								<a href={item.url} target="_blank" referrerPolicy="no-referrer" className="text-teal-200 hover:text-teal-300">
									<i className="fa-sharp fa-solid fa-up-right-from-square" aria-hidden />
								</a>
							)}
							<button type="button" className="text-yellow-200 hover:text-yellow-300" onClick={handleEditClick}>
								<i className="fa-sharp fa-solid fa-pen-to-square" aria-hidden />
							</button>
							<button type="button" className="text-red-300 hover:text-red-400">
								<i className="fa-sharp fa-solid fa-trash-xmark" aria-hidden />
							</button>
						</div>
					</div>
				</div>

				{isEditing && (
					<>
						<hr className="border-gray-200 dark:border-gray-700" />
						{/* TODO actually populate this */}
						<AddItemForm listId={item.list_id} />
					</>
				)}
			</div>
		</div>
	)
}
