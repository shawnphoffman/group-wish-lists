'use client'

import { useCallback, useTransition } from 'react'
import { faStar as faStarRegular } from '@awesome.me/kit-ac8ad9255a/icons/sharp/regular'
import { faStar } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { setPrimaryList, unsetPrimaryList } from '@/app/actions/lists'
import { LoadingIcon } from '@/components/icons/Icons'
import { List } from '@/components/types'

type Props = {
	listId: List['id']
	isPrimary: boolean
}

export default function PrimaryListButton({ listId, isPrimary }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(
		async (e: React.MouseEvent<SVGSVGElement>) => {
			e.preventDefault()
			const resp = isPrimary ? await unsetPrimaryList(listId) : await setPrimaryList(listId)
			if (resp?.status === 'success') {
				startTransition(() => {
					router.refresh()
				})
			}
		},
		[isPrimary, listId, router]
	)

	if (isPending) return <LoadingIcon fixedWidth size="lg" />

	return isPrimary ? (
		<FontAwesomeIcon
			// title="Click to turn off your primary list"
			fixedWidth
			icon={faStar}
			className="text-yellow-500 cursor-pointer hover:text-yellow-400"
			onClick={handleClick}
		/>
	) : (
		<FontAwesomeIcon
			// title="Click to set as primary list"
			fixedWidth
			icon={faStarRegular}
			className="cursor-pointer text-yellow-500/50 hover:text-yellow-500/75"
			onClick={handleClick}
		/>
	)
}
