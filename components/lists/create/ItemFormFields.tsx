'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
// @ts-expect-error
import { useFormStatus } from 'react-dom'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import { ItemPriority, ItemPriorityType } from '@/utils/enums'

import { List, ListItem, Scrape } from '../types'
import { getImageFromScrape } from './ScrapePreview'

type Props = {
	listId: List['id']
	scrape?: Scrape
	clearScrape?: () => void
	formState: any
	item?: ListItem
}

export default function ItemFormFields({ listId, scrape, clearScrape, formState, item }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const { pending: isFormPending } = useFormStatus()

	// Item Fields
	const [id] = useState<string>(item?.id || '')
	const [title, setTitle] = useState<string>(item?.title || '')
	const [notes, setNotes] = useState<string>(item?.notes || '')
	const [url, setUrl] = useState<string>(item?.url || '')
	const [priority, setPriority] = useState<ItemPriorityType>((item?.priority as ItemPriorityType) || ItemPriority.Normal)
	const [imageUrl, setImageUrl] = useState<string>(item?.image_url || '')

	const isDisabled = isFormPending || isPending || title.trim().length === 0
	const pending = isFormPending || isPending

	useEffect(() => {
		if (item || !scrape?.result) return
		if (scrape.result?.ogTitle) setTitle(scrape.result.ogTitle)
		if (scrape.result?.ogUrl) setUrl(scrape.result.ogUrl)
		const imageUrl = getImageFromScrape(scrape)
		console.log('scrape', { scrape, imageUrl })
		setImageUrl(imageUrl)
	}, [scrape])

	const handleChangeTitle = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setTitle(e.target.value)
	}, [])

	const handleChangeNotes = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setNotes(e.target.value)
	}, [])

	const handleChangeUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value)
	}, [])

	const handleChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setPriority(e.target.value as (typeof ItemPriority)[keyof typeof ItemPriority])
	}, [])

	const clearImageUrl = useCallback(() => {
		setImageUrl('')
	}, [])

	useEffect(() => {
		if (formState?.status === 'success') {
			startTransition(() => {
				// Editing?
				router.refresh()
				setTitle('')
				setNotes('')
				setUrl('')
				setPriority(ItemPriority.Normal)
				setImageUrl('')
				if (clearScrape) clearScrape()
			})
		}
	}, [formState])

	return (
		<fieldset disabled={pending}>
			<input className="input" type="hidden" name="id" value={id} readOnly />
			<input className="input" type="hidden" name="list-id" value={listId} readOnly />
			<input className="input" type="hidden" name="scrape" value={JSON.stringify(scrape || {})} readOnly />
			<input className="input" type="hidden" name="image-url" value={imageUrl} readOnly />

			<div className="flex flex-col justify-between gap-2">
				<div>
					<label className="label">Title</label>
					<span className="relative text-red-500 bottom-1">
						<FontAwesomeIcon className=" fa-sharp fa-solid fa-asterisk fa-2xs" />
					</span>
					<textarea name="title" placeholder="Something Cool" value={title} rows={1} onChange={handleChangeTitle} />
				</div>

				<div>
					<label className="label">URL</label>
					<input className="input" type="url" name="url" placeholder="https://wow.cool/" value={url} onChange={handleChangeUrl} />
				</div>

				<div>
					<label className="label">Notes</label>
					<textarea name="notes" placeholder="Size: Schmedium" rows={3} value={notes} onChange={handleChangeNotes} />
				</div>

				<div>
					<label className="label">Priority</label>
					<select name="priority" placeholder="Priority" value={priority} onChange={handleChangePriority}>
						<option disabled value=""></option>
						{Object.keys(ItemPriority).map((key: any) => (
							<option key={key} value={ItemPriority[key as keyof typeof ItemPriority]}>
								{key}
							</option>
						))}
					</select>
				</div>

				{imageUrl && (
					<div className="flex flex-row gap-4 items-center w-full max-w-[24rem] justify-center self-center relative mt-4">
						<img src={imageUrl} alt={title} className="object-scale-down rounded-lg" />
						<i
							onClick={clearImageUrl}
							className="fa-duotone fa-circle-xmark text-3xl cursor-pointer !absolute !top-[-1rem] !right-[-1rem] remove"
							aria-hidden
						/>
					</div>
				)}

				<div>
					<button type="submit" className="w-full btn" disabled={isDisabled}>
						{pending ? (
							<span className="drop-shadow-lg ">{item ? 'Saving' : 'Adding'}...</span>
						) : (
							<span className="drop-shadow-lg ">{item ? 'Save Changes' : 'Add Item'}</span>
						)}
					</button>
				</div>
			</div>
		</fieldset>
	)
}
