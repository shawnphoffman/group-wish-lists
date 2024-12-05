'use client'

import { useCallback, useState } from 'react'
import { faHeadSideBrain } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Linkify from 'linkify-react'
import { useRouter } from 'next/navigation'

import { deleteAddon } from '@/app/actions/addons'
import { DeleteIcon, LoadingIcon } from '@/components/icons/Icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateBasedOnAge } from '@/utils/date'

type Props = {
	created_at: string
	id: number
	is_gifter: boolean
	description: string
	display_name: string
}

const linkOptions = {
	className: 'underline hover:text-primary',
	target: '_blank',
}

export default function ListAddon({ id, is_gifter, description, display_name, created_at }: Props) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleDelete = useCallback(() => {
		async function asyncDeleteComment() {
			setLoading(true)
			await deleteAddon(id)
			router.refresh()
			setLoading(false)
		}
		asyncDeleteComment()
	}, [id, router])

	return (
		<div className="flex flex-col w-full gap-2 p-3 hover:bg-muted">
			<div className="flex flex-row gap-x-3.5 items-center">
				{/*  */}
				<FontAwesomeIcon icon={faHeadSideBrain} className="text-yellow-600 dark:text-yellow-300" />

				<div className="flex flex-col md:flex-row gap-x-3.5 md:items-center w-full">
					{/*  */}
					<div className="flex flex-col justify-center flex-1 gap-0 overflow-hidden">
						<div className="break-words whitespace-pre-line">
							<Linkify options={linkOptions}>{description}</Linkify>
						</div>
						<div className="text-xs italic break-words whitespace-pre-line text-muted-foreground/50">
							Added: {formatDateBasedOnAge(created_at)}
						</div>
					</div>

					<div className="flex flex-row self-end md:self-center items-center gap-3.5">
						{/*  */}
						<Badge variant={'outline'} className="">
							{display_name}
						</Badge>

						{/*  */}
						{is_gifter && (
							<Button variant="outline" size="sm" className="w-8 h-8 p-2" onClick={handleDelete} disabled={loading}>
								{loading ? <LoadingIcon size="lg" /> : <DeleteIcon />}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
