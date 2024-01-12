import { ItemStatus } from '@/utils/enums'

import ItemPriorityIcon from '../icons/PriorityIcon'
import { ListItem } from './types'

type Props = {
	item: ListItem
	isOwnerView: boolean
}

export default function ListItemRow({ item, isOwnerView }: Props) {
	if (!item) return null

	const isComplete = item.status === ItemStatus.Complete

	return (
		<div
			className={`flex flex-row items-stretch gap-x-3.5 gap-y-4 py-2.5 px-4 text-base font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 ${
				isComplete && 'hover:dark:bg-gray-900/65 opacity-75'
			}`}
		>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					<div className="flex flex-col items-center justify-center w-4 shrink-0">
						{/* Priority */}
						<ItemPriorityIcon priority={item.priority} />
					</div>
					{!isOwnerView && <input type="checkbox" checked={isComplete} />}
					<div className="flex flex-col items-center flex-1 gap-2 md:flex-row md:gap-4">
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div className="">{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="text-sm text-gray-400">{item.notes}</div>}
						</div>
						{/* Image */}
						{item.image_url && <img src={item.image_url} alt={item.title} className="object-scale-down w-24 rounded-lg" />}
						{/* Actions
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
						</div> */}
					</div>
				</div>
			</div>
		</div>
	)
}
