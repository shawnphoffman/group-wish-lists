'use client'

import { useCallback, useEffect, useState } from 'react'
import { faSolidSquareCheckLock } from '@awesome.me/kit-ac8ad9255a/icons/kit/custom'
import { faSpinnerScale } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createGift, deleteGift } from '@/app/actions/gifts'
import { ListItem } from '@/components/types'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
	id: ListItem['id']
	isComplete: boolean
	canChange: boolean
}

export default function ItemCheckbox({ id, isComplete, canChange }: Props) {
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

	if (!canChange) {
		return checked ? (
			<FontAwesomeIcon icon={faSolidSquareCheckLock} size="xl" className="text-secondary" />
		) : (
			<FontAwesomeIcon icon={faSolidSquareCheckLock} size="xl" className="text-muted" />
		)
	}

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center">
			{isPending ? (
				<FontAwesomeIcon icon={faSpinnerScale} size="xl" spinPulse />
			) : (
				<Checkbox checked={checked} disabled={isPending} onCheckedChange={handleChange} />
			)}
		</fieldset>
	)
}
