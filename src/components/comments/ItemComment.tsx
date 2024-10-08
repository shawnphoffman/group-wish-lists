'use client'

import { useCallback, useState } from 'react'
import { faComment } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistance, set } from 'date-fns'
import { useRouter } from 'next/navigation'

import { deleteComment } from '@/app/actions/comments'
import { DeleteIcon, LoadingIcon } from '@/components/icons/Icons'
import { Comment } from '@/components/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
	comment: Comment
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
		<Alert key={id} className="border-0 rounded-none">
			<FontAwesomeIcon icon={faComment} className="!text-secondary" />
			<AlertTitle className="flex items-center gap-2">
				<span>{user.display_name}</span>
				<Badge variant={'outline'} className="text-[11px]">
					{formatDistance(new Date(created_at), new Date(), { addSuffix: true })}
				</Badge>
			</AlertTitle>
			<AlertDescription className="flex flex-row items-center justify-between">
				<div>{comments}</div>
				{isOwner && (
					<Button variant="outline" size="sm" className="w-8 h-8 p-2" onClick={handleDelete} disabled={loading}>
						{loading ? <LoadingIcon size="lg" /> : <DeleteIcon />}
					</Button>
				)}
			</AlertDescription>
		</Alert>
	)
}
