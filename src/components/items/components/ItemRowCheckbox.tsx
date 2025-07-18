'use client'

import { useCallback, useState } from 'react'
import { faSpinnerScale } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createGift, deleteGift } from '@/app/actions/gifts'
import { cn } from '@/lib/utils'

type Props = {
	type: 'add' | 'delete' | 'edit'
	children: React.ReactNode
	id: string
}

const commonSizes = 'w-10 h-8 sm:h-6 flex flex-row items-center justify-center'
const commonIconSizes = 'text-3xl sm:text-2xl'

export default function ItemRowCheckbox({ type, children, id }: Props) {
	const [isPending, setIsPending] = useState(false)
	const router = useRouter()

	const handleClick = useCallback(async () => {
		setIsPending(true)
		console.log('handleClick')

		await new Promise(resolve => setTimeout(resolve, 5000))

		if (type === 'add') {
			await createGift(id)
		} else if (type === 'delete') {
			await deleteGift(id)
		} else if (type === 'edit') {
			console.log('editGift', id)
			// editGift(id)
		}

		setIsPending(false)
		router.refresh()
	}, [id, router, type])

	if (isPending) {
		return (
			<div className={cn('', commonSizes)}>
				<FontAwesomeIcon icon={faSpinnerScale} spinPulse className={cn('text-yellow-500', commonIconSizes)} />
			</div>
		)
	}

	return (
		<button onClick={handleClick} className={cn('cursor-pointer', commonSizes)}>
			{children}
		</button>
	)
}
