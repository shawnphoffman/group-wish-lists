'use client'

import './ItemCheckbox.css'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createGift, deleteGift } from '@/app/actions/gifts'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
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
					<FontAwesomeIcon className="text-2xl fa-sharp fa-solid fa-spinner-scale fa-spin-pulse sm:text-lg" />
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
