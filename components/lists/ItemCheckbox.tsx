'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { createGift } from '@/app/actions/gifts'

import { ItemStatus } from '@/utils/enums'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import { ListItem } from './types'

type Props = {
	item: ListItem
}

export default function ItemCheckbox({ item }: Props) {
	const [checked, setChecked] = useState(item.status === ItemStatus.Complete)
	const [isPending, setIsPending] = useState(false)
	const router = useRouter()

	const handleChange = useCallback(() => {
		setIsPending(true)
		setChecked(!checked)
		async function updateItemStatus() {
			await createGift(item.id)
			setIsPending(false)
			router.refresh()
		}
		updateItemStatus()
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
