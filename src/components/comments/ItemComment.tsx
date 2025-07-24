'use client'

import { useCallback, useState } from 'react'
import { faComment } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistance } from 'date-fns'
import Linkify from 'linkify-react'
import { useRouter } from 'next/navigation'

import { deleteComment } from '@/app/actions/comments'
import { DeleteIcon, LoadingIcon } from '@/components/icons/Icons'
import { Comment } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
	comment: Comment
}

const linkOptions = {
	className: 'underline hover:text-primary break-all',
	target: '_blank',
}

export default function ItemComment({ comment }: Props) {
	const { id, comments, isOwner, user, created_at } = comment
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleDelete = useCallback(() => {
		async function asyncDeleteComment() {
			setLoading(true)
			await deleteComment(id)
			router.refresh()
			setLoading(false)
		}
		asyncDeleteComment()
	}, [id, router])

	// console.log('comments:', comments)
	return (
		<div key={id} className="flex flex-row items-center gap-2 px-3 py-2 border-0 rounded-none justify-stretch bg-background">
			<div className="!text-secondary self-start leading-6">
				<FontAwesomeIcon icon={faComment} />
			</div>
			<div className="flex flex-col items-start w-full gap-1">
				<div className="flex items-center justify-center gap-2">
					<span className="font-medium">{user.display_name}</span>
					<Badge variant={'outline'} className="text-[11px]">
						{formatDistance(new Date(created_at), new Date(), { addSuffix: true })}
					</Badge>
				</div>
				<div className="flex flex-row items-center justify-between text-sm">
					<Linkify options={linkOptions}>{comments}</Linkify>
				</div>
			</div>
			{isOwner && (
				<Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
					{loading ? <LoadingIcon size="lg" /> : <DeleteIcon size="lg" />}
				</Button>
			)}
		</div>
	)
}
