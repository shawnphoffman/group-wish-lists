'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { faComments } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'

import { createComment } from '@/app/actions/comments'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { ListItem } from '../types'

function AddCommentFields() {
	const { pending } = useFormStatus()

	// TODO Detect if they put the word "purchased" in the comment and warn them that the list owner will see it.

	return (
		<>
			<fieldset disabled={pending} className="flex flex-col gap-4">
				{/* <Label htmlFor="comment">Add a Comment</Label> */}
				<Textarea
					name="comment"
					autoFocus
					required
					placeholder="The list owner will be able to see this. Seriously, don't put that you purchased it in the comment."
				/>
			</fieldset>
			<DialogFooter>
				<Button type="submit" disabled={pending}>
					{pending ? 'Commenting...' : 'Comment'}
				</Button>
			</DialogFooter>
		</>
	)
}

type Props = {
	itemId: ListItem['id']
}

export default function AddCommentButton({ itemId }: Props) {
	const [open, setOpen] = useState(false)
	const [state, formAction] = useActionState(createComment, {})
	const router = useRouter()
	const pathname = usePathname()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.status === 'success') {
			// console.log('createComment.state', state)
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
			<DialogTrigger asChild>
				<Button variant="ghost" type="button" size="icon" className="group">
					<FontAwesomeIcon
						icon={faComments}
						size="lg"
						className="text-blue-500 hover:text-blue-600 group-hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:group-hover:text-blue-300"
						suppressHydrationWarning
					/>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a Comment</DialogTitle>
					<DialogDescription>Recipients can see the comments so do not put spoilers in them.</DialogDescription>
				</DialogHeader>
				<form action={formAction} ref={formRef} className="flex flex-col gap-4">
					<input className="input" type="hidden" name="item-id" value={itemId} readOnly />
					<AddCommentFields />
				</form>
			</DialogContent>
		</Dialog>
	)
}
