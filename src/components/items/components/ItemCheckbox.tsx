'use client'

import './ItemCheckbox.css'

import { useCallback, useEffect, useState } from 'react'
import { faSpinnerScale } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createGift, deleteGift } from '@/app/actions/gifts'
import { ListItem } from '@/components/types'

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
		(e: any) => {
			e.preventDefault()
			setIsPending(true)
			setChecked(!checked)
			async function updateItemStatus() {
				if (!checked) {
					await createGift(id)
				} else {
					await deleteGift(id)
				}
				setIsPending(false)
				router.refresh()
			}
			updateItemStatus()
		},
		[checked, router, id]
	)

	useEffect(() => {
		if (isComplete !== checked) {
			setChecked(isComplete)
		}
	}, [checked, isComplete])

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center">
			{isPending ? (
				<div className="flex items-center justify-center checkbox-size">
					<FontAwesomeIcon icon={faSpinnerScale} spinPulse className="text-2xl sm:text-lg" />
				</div>
			) : (
				<input
					type="checkbox"
					checked={checked}
					onChange={canChange ? handleChange : undefined}
					readOnly={!canChange}
					className={`${isPending && '!bg-yellow-500'}`}
				/>
			)}
		</fieldset>
	)
}
