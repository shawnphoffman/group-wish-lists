'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { faCirclePlus } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'

import { createAddon } from '@/app/actions/addons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { List } from '../types'

function AddAddonFields() {
	const { pending } = useFormStatus()

	return (
		<>
			<fieldset disabled={pending} className="flex flex-col gap-4">
				{/* <Label htmlFor="comment">Add a Comment</Label> */}
				<Textarea name="description" autoFocus required placeholder="What did you get?" />
			</fieldset>
			<DialogFooter>
				<Button disabled={pending}>{pending ? 'Saving...' : 'Save'}</Button>
			</DialogFooter>
		</>
	)
}

type Props = {
	listId: List['id']
}

export default function AddAddonButton({ listId }: Props) {
	const [open, setOpen] = useState(false)
	const [state, formAction] = useActionState(createAddon, {})
	const router = useRouter()
	const pathname = usePathname()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.status === 'success') {
			// console.log('createComment.state', state)
			if (formRef?.current) {
				formRef.current.reset()
			}
			setOpen(false)
			startTransition(() => {
				router.refresh()
			})
		}
	}, [state, pathname, router])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="flex gap-1" size="sm">
					<FontAwesomeIcon
						icon={faCirclePlus}
						className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 group-hover:text-yellow-500 dark:hover:text-yellow-300 dark:group-hover:text-yellow-300"
					/>
					Add
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add an Addon</DialogTitle>
					<DialogDescription>Recipients can not see addons. They are basically intuition gifts.</DialogDescription>
				</DialogHeader>
				<form action={formAction} ref={formRef} className="flex flex-col gap-4">
					<input className="input" type="hidden" name="list-id" value={listId} readOnly />
					<AddAddonFields />
				</form>
			</DialogContent>
		</Dialog>
	)
}
