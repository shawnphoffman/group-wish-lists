'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { createItem } from '@/app/actions/items'

import Select from '@/components/core/Select'
import Textarea from '@/components/core/Textarea'

import { ItemPriority } from '@/utils/enums'

import { Scrape } from './ScrapePreview'

type Props = {
	listId: string
	scrape?: Scrape
	clearScrape?: () => void
}

export default function AddItemForm({ listId, scrape, clearScrape }: Props) {
	const router = useRouter()
	const formRef = useRef<HTMLFormElement>(null)
	const [state, formAction] = useFormState(createItem, {})
	const [isPending, startTransition] = useTransition()

	const [isEditing, setIsEditing] = useState(false)

	// Item Fields
	const [title, setTitle] = useState<string>('')
	const [notes, setNotes] = useState<string>('')
	const [url, setUrl] = useState<string>('')
	const [priority, setPriority] = useState<(typeof ItemPriority)[keyof typeof ItemPriority] | ''>(ItemPriority.Normal)
	const [imageUrl, setImageUrl] = useState<string>('') //TODO

	const isDisabled = isPending || title.trim().length === 0

	useEffect(() => {
		if (!scrape?.result) return
		if (scrape.result?.ogTitle) setTitle(scrape.result.ogTitle)
		if (scrape.result?.ogUrl) setUrl(scrape.result.ogUrl)
		if (scrape.result?.ogImage?.length && scrape.result?.ogImage[0]?.url) {
			setImageUrl(scrape.result.ogImage[0].url)
		} else {
			setImageUrl('')
		}
	}, [scrape])

	const handleClick = useCallback(async () => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	const handleChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}, [])

	const handleChangeNotes = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNotes(e.target.value)
	}, [])

	const handleChangeUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value)
	}, [])

	const handleChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setPriority(e.target.value as (typeof ItemPriority)[keyof typeof ItemPriority])
	}, [])

	useEffect(() => {
		if (state?.status === 'success') {
			startTransition(() => {
				setIsEditing(() => !isEditing)
				router.refresh()
				setTitle('')
				setNotes('')
				setUrl('')
				setPriority(ItemPriority.Normal)
				setImageUrl('')
				if (clearScrape) clearScrape()
			})
		}
	}, [state])

	return (
		// <div className="flex flex-col gap-2 items-stretch border border-dashed border-purple-400 p-4">
		<div className="flex flex-col gap-2 items-stretch p-2">
			<h5>Item Details</h5>

			<form action={formAction} ref={formRef}>
				<fieldset disabled={isPending}>
					<input className="input" type="hidden" name="list-id" value={listId} readOnly />
					<input className="input" type="hidden" name="scrape" value={JSON.stringify(scrape || {})} readOnly />

					<div className="flex flex-col justify-between gap-2">
						<div>
							<label className="label">Title</label>
							<i className="fa-sharp fa-solid fa-asterisk fa-2xs text-red-500 relative bottom-1" aria-hidden />
							<input className="input" type="text" name="title" placeholder="Something Cool" value={title} onChange={handleChangeTitle} />
						</div>

						<div>
							<label className="label">URL</label>
							<input className="input" type="url" name="url" placeholder="https://wow.cool/" value={url} onChange={handleChangeUrl} />
						</div>

						<div>
							<label className="label">Notes</label>
							<Textarea name="notes" placeholder="Size: Schmedium" rows={3} value={notes} onChange={handleChangeNotes} />
						</div>

						<div>
							<label className="label">Priority</label>
							<Select name="priority" placeholder="Priority" value={priority} onChange={handleChangePriority}>
								<option disabled value=""></option>
								{Object.keys(ItemPriority).map((key: any) => (
									<option key={key} value={ItemPriority[key as keyof typeof ItemPriority]}>
										{key}
									</option>
								))}
							</Select>
						</div>

						{imageUrl && (
							<div className="flex flex-row gap-4 items-center w-full max-w-[24rem] justify-center self-center">
								<img src={imageUrl} alt={title} className="object-scale-down rounded-lg" />
							</div>
						)}

						<div>
							<button type="submit" onClick={handleClick} className="btn w-full" disabled={isDisabled}>
								<span className="drop-shadow-lg ">Add Item</span>
							</button>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	)
}
