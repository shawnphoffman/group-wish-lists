import Link from 'next/link'

import { getSessionUser } from '@/app/actions/auth'

import Badge from '@/components/common/Badge'
import { OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemCheckbox from '@/components/items/components/ItemCheckbox'
import ItemImage from '@/components/items/components/ItemImage'
import { Gift, ListItem } from '@/components/types'

import { ItemPriority, ItemStatus } from '@/utils/enums'

type Props = {
	item: ListItem & Gift
	isOwnerView: boolean
}

export default async function ItemRow({ item, isOwnerView }: Props) {
	if (!item) return null

	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const userPromise = getSessionUser()
	const [currentUser] = await Promise.all([
		userPromise,
		// fakePromise
	])

	// console.log('ListItemRow', item)

	const isComplete = !isOwnerView && item.status === ItemStatus.Complete
	const userCanChange = item?.gifter_user_id === currentUser?.id || item.status !== ItemStatus.Complete

	return (
		<div className={`list-item ${isComplete && 'complete'}`}>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority & Checkbox */}
					<div className="flex flex-col items-center justify-center gap-2 shrink-0">
						{/* Priority */}
						{item.priority !== ItemPriority.Normal && <ItemPriorityIcon priority={item.priority} />}
						{/* Checkbox */}
						{!isOwnerView && <ItemCheckbox id={item.id} isComplete={isComplete} canChange={userCanChange} />}
					</div>
					{/*  */}
					<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div>{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="notes">{item.notes}</div>}

							{/* Gifter */}
							{isComplete && (
								<Badge className="self-start mt-1 xxs" colorId={item.gifter_id}>
									{item.display_name}
								</Badge>
							)}
						</div>

						{/* Image + Actions */}
						<div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
							{/* Image */}
							<ItemImage url={item.image_url} className="w-16 max-h-16 xs:w-24 xs:max-h-24" />
							{/* Actions */}
							{item.url && (
								<Link href={item.url} target="_blank" className="sm:text-xl nav-btn teal">
									<OpenUrlIcon includeColor={false} />
									<span className="inline text-sm sm:hidden">Link</span>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
