'use client'

import { useCallback, useTransition } from 'react'
import { faStar as faStarRegular } from '@awesome.me/kit-f973af7de0/icons/sharp/regular'
import { faStar } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { setPrimaryList, unsetPrimaryList } from '@/app/actions/lists'
import { LoadingIcon } from '@/components/icons/Icons'
import { List } from '@/components/types'
import { useToast } from '@/hooks/use-toast'

type Props = {
	listId: List['id']
	isPrimary: boolean
}

export default function PrimaryListButton({ listId, isPrimary }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const { toast } = useToast()

	const handleClick = useCallback(
		(e: React.MouseEvent<SVGSVGElement>) => {
			e.preventDefault()
			if (isPending) return

			startTransition(async () => {
				const resp = isPrimary ? await unsetPrimaryList(listId) : await setPrimaryList(listId)

				if (resp?.status === 'conflict') {
					toast({
						title: 'Another primary list was just set',
						description: 'Refreshing so you see the current state.',
						variant: 'destructive',
					})
					router.refresh()
				} else if (resp?.status === 'error') {
					toast({
						title: 'Could not update primary list',
						description: resp.message,
						variant: 'destructive',
					})
					router.refresh()
				}
			})
		},
		[isPending, isPrimary, listId, router, toast]
	)

	if (isPending) return <LoadingIcon fixedWidth size="lg" />

	return isPrimary ? (
		<FontAwesomeIcon
			fixedWidth
			icon={faStar}
			className="text-yellow-500 cursor-pointer hover:text-yellow-400"
			onClick={handleClick}
		/>
	) : (
		<FontAwesomeIcon
			fixedWidth
			icon={faStarRegular}
			className="cursor-pointer text-yellow-500/50 hover:text-yellow-500/75"
			onClick={handleClick}
		/>
	)
}
