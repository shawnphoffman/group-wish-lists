'use client'

import { startTransition, useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { faComments } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'

import { createComment } from '@/app/actions/comments'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { ListItem } from '../types'

function AddCommentFields() {
	const { pending } = useFormStatus()

	return (
		<>
			<fieldset disabled={pending} className="flex flex-col gap-4">
				{/* <Label htmlFor="comment">Add a Comment</Label> */}
				<Textarea name="comment" autoFocus required placeholder="Something interesting..." />
			</fieldset>
			<DialogFooter>
				<Button disabled={pending}>{pending ? 'Commenting...' : 'Comment'}</Button>
			</DialogFooter>
		</>
	)
}

type Props = {
	itemId: ListItem['id']
}

export default function AddCommentButton({ itemId }: Props) {
	const [open, setOpen] = useState(false)
	const [state, formAction] = useFormState(createComment, {})
	const router = useRouter()
	const pathname = usePathname()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.status === 'success') {
			startTransition(() => {
				if (formRef?.current) {
					formRef.current.reset()
				}
				setOpen(false)
				router.refresh()
			})
		}
	}, [state, pathname, router])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<FontAwesomeIcon icon={faComments} size="lg" className="text-blue-400 hover:text-blue-300 group-hover:text-blue-300" />
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Add a Comment</DialogTitle>
				<form action={formAction} ref={formRef} className="flex flex-col gap-4">
					<input className="input" type="hidden" name="item-id" value={itemId} readOnly />
					<AddCommentFields />
				</form>
			</DialogContent>
		</Dialog>
	)
}
