'use client'

import { startTransition, useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'

import { createList } from '@/app/actions/lists'
import { AddIcon } from '@/components/icons/Icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ListCategory } from '@/utils/enums'

import ListTypeIcon from '../icons/ListTypeIcon'

function CreateListFields() {
	const { pending } = useFormStatus()

	return (
		<>
			<fieldset disabled={pending}>
				<div className="flex flex-col gap-4 py-4">
					{/* TEXTAREA */}
					<div className="grid w-full gap-2">
						<Label htmlFor="input-name">Title</Label>
						<Input name="list-name" autoFocus required placeholder="Your Cool List" />
					</div>

					<div className="grid w-full gap-2">
						<Label htmlFor="list-privacy">Privacy</Label>
						<RadioGroup name="list-privacy" defaultValue="public" className="ps-1">
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="public" id="public" />
								<Label>Public</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="private" id="private" />
								<Label>Private</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="grid w-full gap-2">
						<Label htmlFor="list-type">List Type</Label>
						<RadioGroup name="list-type" defaultValue={`${ListCategory.Christmas}`} className="ps-1">
							{Object.entries(ListCategory).map(
								([key, value]) =>
									value !== 'test' && (
										<div className="flex items-center space-x-2" key={key}>
											<RadioGroupItem value={value} />
											<Label className="flex flex-row items-center gap-1">
												<ListTypeIcon type={value} className="text-sm" />
												{key.replace(/(?<!^)([A-Z])/g, ' $1')}
											</Label>
										</div>
									)
							)}
						</RadioGroup>
					</div>
				</div>
			</fieldset>
			<DialogFooter>
				<Button disabled={pending}>{pending ? 'Creating...' : 'Create'}</Button>
			</DialogFooter>
		</>
	)
}

export default function NewListButton() {
	const [open, setOpen] = useState(false)
	const [state, formAction] = useFormState(createList, {})
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
			<DialogTrigger asChild>
				<Button variant="ghost" className="gap-1" size="sm">
					<AddIcon />
					New List
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New List</DialogTitle>
					<DialogDescription>Who can help edit the items on this list?</DialogDescription>
				</DialogHeader>
				<form action={formAction} ref={formRef}>
					<CreateListFields />
				</form>
			</DialogContent>
		</Dialog>
	)
}
