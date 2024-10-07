'use client'

import './PermissionCheckbox.css'

import { useCallback, useEffect, useState } from 'react'
import { faSpinnerScale } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { ListItem } from '@/components/types'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
	id: ListItem['id']
	isComplete: boolean
}

export default function PermissionCheckbox({ id, isComplete }: Props) {
	const [checked, setChecked] = useState(isComplete)
	const [isPending, setIsPending] = useState(false)
	const router = useRouter()

	const handleChange = useCallback(
		(newChecked: boolean) => {
			console.log('PermissionCheckbox:', newChecked)
			setIsPending(true)
			setChecked(newChecked)
			async function updateItemStatus() {
				if (!newChecked) {
					await new Promise(resolve => setTimeout(resolve, 2000))
					// await createGift(id)
				} else {
					await new Promise(resolve => setTimeout(resolve, 2000))
					// await deleteGift(id)
				}
				setIsPending(false)
				// router.refresh()
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

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center">
			{isPending ? (
				<FontAwesomeIcon icon={faSpinnerScale} spinPulse />
			) : (
				<Checkbox checked={checked} disabled={isPending} onCheckedChange={handleChange} />
			)}
		</fieldset>
	)
}
