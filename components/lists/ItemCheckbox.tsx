'use client'

import { useCallback, useEffect, useState } from 'react'

import { ItemStatus } from '@/utils/enums'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import { ListItem } from './types'

type Props = {
	item: ListItem
}

export default function ItemCheckbox({ item }: Props) {
	const [checked, setChecked] = useState(item.status === ItemStatus.Complete)
	const [isPending, setIsPending] = useState(false)

	const handleChange = useCallback(() => {
		setIsPending(true)
		setChecked(() => !checked)
	}, [checked])

	useEffect(() => {
		let isSubscribed = true
		async function updateItemStatus() {
			// if (checked) {
			// 	console.log('item was check. marking as complete')
			// } else {
			// 	console.log('item was unchecked. marking as incomplete')
			// }
			// await new Promise(resolve => setTimeout(resolve, 2000))
			if (isSubscribed) {
				setIsPending(false)
			}
		}
		updateItemStatus()

		return () => {
			isSubscribed = false
		}
	}, [checked])

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center">
			{isPending ? (
				<div className="flex items-center justify-center w-5 h-5">
					<FontAwesomeIcon className="fa-sharp fa-solid fa-spinner-scale fa-spin-pulse" />
				</div>
			) : (
				<input type="checkbox" defaultChecked={checked} onChange={handleChange} className={`${isPending && '!bg-yellow-500'}`} />
			)}
		</fieldset>
	)
}
