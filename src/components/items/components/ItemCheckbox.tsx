import { faSquare } from '@awesome.me/kit-ac8ad9255a/icons/classic/regular'
import { faSquareCheck, faSquareRing, faSquareX } from '@awesome.me/kit-ac8ad9255a/icons/classic/solid'
import { faSolidSquareCheckLock } from '@awesome.me/kit-ac8ad9255a/icons/kit/custom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getGifts } from '@/app/actions/gifts'
import { ListItem } from '@/components/types'
import { cn } from '@/lib/utils'
import { ItemStatus, ItemStatusType } from '@/utils/enums'

import ItemRowCheckbox from './ItemRowCheckbox'

type Props = {
	id: ListItem['id']
	status: ItemStatusType
	requestedQty: number
	currentUserId?: string
}

const commonSizes = 'w-10 h-8 sm:h-6 flex flex-row items-center justify-center'
const commonIconSizes = 'text-3xl sm:text-2xl'

export default async function ItemCheckbox({ id, status, requestedQty = 1, currentUserId }: Props) {
	if (status === ItemStatus.Incomplete) {
		return (
			<ItemRowCheckbox type={'add'} id={id} otherQty={0} selfQty={0} quantity={requestedQty}>
				<FontAwesomeIcon icon={faSquare} className={cn('text-green-500', commonIconSizes)} />
			</ItemRowCheckbox>
		)
	}

	const gifts = await getGifts(id)

	const giftQty = gifts?.reduce((acc, gift) => acc + gift.quantity, 0) || 0

	const isPartial = giftQty < requestedQty
	const isComplete = giftQty === requestedQty

	const selfQty = gifts?.find(gift => gift.gifter_id === currentUserId)?.quantity || 0
	const otherQty = giftQty - selfQty

	const userHasGifted = selfQty > 0
	const isLocked = isComplete && !userHasGifted

	if (status === ItemStatus.Unavailable) {
		return (
			<div className={cn('cursor-not-allowed', commonSizes)}>
				<FontAwesomeIcon icon={faSquareX} className={cn('text-destructive/75', commonIconSizes)} />
			</div>
		)
	}

	if (isLocked) {
		return (
			<div className={cn('cursor-not-allowed', commonSizes)}>
				<FontAwesomeIcon icon={faSolidSquareCheckLock} className={cn('text-sky-500', commonIconSizes)} />
			</div>
		)
	}

	const clickType = !isPartial ? 'delete' : userHasGifted ? 'edit' : 'add'

	return (
		<ItemRowCheckbox type={clickType} id={id} otherQty={otherQty} selfQty={selfQty} quantity={requestedQty}>
			{isPartial ? (
				<FontAwesomeIcon icon={faSquareRing} className={cn('text-orange-500', commonIconSizes)} />
			) : isComplete ? (
				<FontAwesomeIcon icon={faSquareCheck} className={cn('text-green-500', commonIconSizes)} />
			) : null}
		</ItemRowCheckbox>
	)
}
