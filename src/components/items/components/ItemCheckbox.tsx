'use client'

import { useCallback, useEffect, useState } from 'react'
import { faSolidSquareCheckLock } from '@awesome.me/kit-ac8ad9255a/icons/kit/custom'
import { faSpinnerScale } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { faEmptySet } from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/light'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createGift, deleteGift } from '@/app/actions/gifts'
import { ListItem } from '@/components/types'
import { Checkbox } from '@/components/ui/checkbox'
import { ItemStatus, ItemStatusType } from '@/utils/enums'

type Props = {
	id: ListItem['id']
	isComplete: boolean
	canChange: boolean
	status: ItemStatusType
}

export default function ItemCheckbox({ id, isComplete, canChange, status }: Props) {
	const [checked, setChecked] = useState(isComplete)
	const [isPending, setIsPending] = useState(false)
	const router = useRouter()

	const handleChange = useCallback(
		(newChecked: boolean) => {
			setIsPending(true)
			setChecked(newChecked)
			async function updateItemStatus() {
				if (newChecked) {
					await createGift(id)
				} else {
					await deleteGift(id)
				}
				setIsPending(false)
				router.refresh()
			}
			updateItemStatus()
		},
		[router, id]
	)

	useEffect(() => {
		if (isComplete !== checked) {
			setChecked(isComplete)
		}
	}, [checked, isComplete])

	if (status === ItemStatus.Unavailable) {
		return (
			<div className="flex items-center justify-center w-8 h-8 cursor-not-allowed sm:h-6 sm:w-6">
				<FontAwesomeIcon icon={faEmptySet} size="2xl" className="text-destructive" />
			</div>
		)
	}

	if (!canChange) {
		return checked ? (
			<FontAwesomeIcon icon={faSolidSquareCheckLock} size="2xl" className="text-destructive" />
		) : (
			<FontAwesomeIcon icon={faSolidSquareCheckLock} size="2xl" className="text-muted" />
		)
	}

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center w-8 h-8 sm:h-6 sm:w-6">
			{isPending ? (
				<FontAwesomeIcon icon={faSpinnerScale} size="2xl" spinPulse className="text-secondary" />
			) : (
				<Checkbox checked={checked} disabled={isPending} onCheckedChange={handleChange} />
			)}
		</fieldset>
	)
}
