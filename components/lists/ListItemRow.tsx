import Link from 'next/link'

import { getSessionUser } from '@/app/actions/auth'

import { ItemStatus } from '@/utils/enums'

import Badge from '../common/Badge'
import { OpenImageIcon, OpenUrlIcon } from '../icons/Icons'
import ItemPriorityIcon from '../icons/PriorityIcon'
import ItemCheckbox from './ItemCheckbox'
import ItemImage from './ItemImage'
import { Gift, ListItem } from './types'

type Props = {
	item: ListItem & Gift
	isOwnerView: boolean
}

export default async function ListItemRow({ item, isOwnerView }: Props) {
	if (!item) return null

	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const userPromise = getSessionUser()
	const [currentUser] = await Promise.all([
		userPromise,
		// fakePromise
	])

	console.log('ListItemRow', item)

	const isComplete = !isOwnerView && item.status === ItemStatus.Complete
	const userCanChange = item?.gifter_id === currentUser?.id || item.status !== ItemStatus.Complete

	return (
		<div className={`list-item ${isComplete && 'complete'}`}>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority */}
					<div className="flex flex-col items-center justify-center gap-4 md:flex-row shrink-0">
						<ItemPriorityIcon priority={item.priority} className="w-4" />
						{/* Checkbox */}
						{!isOwnerView && <ItemCheckbox id={item.id} isComplete={isComplete} canChange={userCanChange} />}
					</div>

					<div className="flex flex-col flex-1 gap-2 sm:items-center sm:flex-row sm:gap-4">
						{/* Content */}
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div className="">{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="text-sm text-gray-400">{item.notes}</div>}
						</div>
						{/* Image */}
						<ItemImage url={item.image_url} className="hidden sm:block" />
						{/* Actions */}
						<div className="flex flex-row items-center justify-end gap-4 text-xl sm:gap-2 sm:flex-col">
							{isComplete && (
								<Badge colorLabel={item.display_name} className="xxs">
									{item.display_name}
								</Badge>
							)}
							{item.image_url && (
								<Link
									href={item.image_url}
									target="_blank"
									referrerPolicy="no-referrer"
									className={`max-sm:btn-ringed max-sm:!text-2xl sm:hidden yellow`}
								>
									<OpenImageIcon includeColor={false} />
								</Link>
							)}
							{item.url && (
								<Link
									href={item.url}
									target="_blank"
									referrerPolicy="no-referrer"
									className={`btn-ringed max-sm:!text-2xl max-md:!text-xl teal`}
								>
									<OpenUrlIcon includeColor={false} />
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
