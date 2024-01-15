'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { createGift, deleteGift } from '@/app/actions/gifts'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import { ListItem } from './types'

type Props = {
	id: ListItem['id']
	isComplete: boolean
}

export default function ItemCheckbox({ id, isComplete }: Props) {
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
				<div className="flex items-center justify-center w-5 h-5">
					<FontAwesomeIcon className="fa-sharp fa-solid fa-spinner-scale fa-spin-pulse" />
				</div>
			) : (
				<input type="checkbox" checked={checked} onChange={handleChange} className={`${isPending && '!bg-yellow-500'}`} />
			)}
		</fieldset>
	)
}
