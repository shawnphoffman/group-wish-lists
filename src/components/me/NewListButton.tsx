'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { createList, getUserEditors } from '@/app/actions/lists'
import { AddIcon } from '@/components/icons/Icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ListCategory } from '@/utils/enums'

import ListTypeIcon from '../icons/ListTypeIcon'

function CreateListFields() {
	const { pending } = useFormStatus()

	const [listOptions, setListOptions] = useState<{ user_id: string; display_name: string }[]>([])

	useEffect(() => {
		async function asyncGetListOptions() {
			const opts = await getUserEditors()
			// console.log('opts', opts)
			setListOptions(opts)
		}
		asyncGetListOptions()
	}, [])

	return (
		<>
			<fieldset disabled={pending}>
				<div className="flex flex-col gap-4 py-4">
					{/* TEXTAREA */}
					<div className="grid w-full gap-2">
						<Label htmlFor="input-name">Title</Label>
						<Input name="list-name" autoFocus required placeholder="Your Cool List" />
					</div>

					{/* TYPE */}
					<div className="grid w-full gap-2">
						<Label htmlFor="list-type">What type of list is this?</Label>
						<RadioGroup name="list-type" defaultValue={`${ListCategory.WishList}`} className="ps-1">
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

					{/* PRIVACY */}
					<div className="grid w-full gap-2">
						<Label htmlFor="list-privacy" className="flex flex-row items-center gap-2">
							<span>Privacy</span>
							<span className="items-center text-sm leading-none text-muted-foreground">(Gift Ideas are always private)</span>
						</Label>
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

					{/* RECIPIENT */}
					{listOptions.length > 0 && (
						<div className="grid w-full gap-2">
							<Label htmlFor="list-owner">Who is this list for?</Label>
							<RadioGroup name="list-owner" defaultValue={''} className="ps-1">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value={''} />
									<Label>You</Label>
								</div>
								{listOptions.map(option => (
									<div key={option.user_id} className="flex items-center space-x-2">
										<RadioGroupItem value={option.user_id} id={option.user_id} />
										<Label>{option.display_name}</Label>
									</div>
								))}
							</RadioGroup>
						</div>
					)}
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
	const [state, formAction] = useActionState(createList, {})
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.status === 'success') {
			setOpen(false)
			if (formRef?.current) {
				formRef.current.reset()
			}
			startTransition(() => {
				router.refresh()
			})
		}
	}, [state, pathname, router])

	useEffect(() => {
		if (searchParams.get('new')) {
			setOpen(true)
			router.replace(`${pathname}`)
		}
	}, [pathname, router, searchParams])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-1" size="sm">
					<AddIcon />
					New List
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New List</DialogTitle>
					{/* <DialogDescription>Who can help edit the items on this list?</DialogDescription> */}
				</DialogHeader>
				<form action={formAction} ref={formRef}>
					<CreateListFields />
				</form>
			</DialogContent>
		</Dialog>
	)
}
