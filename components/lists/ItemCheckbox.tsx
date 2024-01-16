'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { createGift, deleteGift } from '@/app/actions/gifts'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import { Gift, ListItem } from './types'

import './ItemCheckbox.css'

type Props = {
	id: ListItem['id']
	isComplete: boolean
	canChange: boolean
}

export default function ItemCheckbox({ id, isComplete, canChange }: Props) {
	const [checked, setChecked] = useState(isComplete)
	const [isPending, setIsPending] = useState(false)
	const router = useRouter()

	const handleChange = useCallback(() => {
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
	}, [checked])

	useEffect(() => {
		if (isComplete !== checked) {
			setChecked(isComplete)
		}
	}, [isComplete])

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
					onChange={handleChange}
					readOnly={!canChange}
					className={`${isPending && '!bg-yellow-500'}`}
				/>
			)}
		</fieldset>
	)
}
