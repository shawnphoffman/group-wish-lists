'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

// import ItemImage from '../components/ItemImage'
import ItemImagePicker from '../components/ItemImagePicker'

import ErrorMessage from '@/components/common/ErrorMessage'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import { List, ListItem, Scrape } from '@/components/types'
import { ItemPriority, ItemPriorityType } from '@/utils/enums'

export const getImageFromScrape = (scrape?: Scrape) => {
	if (scrape?.result?.ogImage?.length && scrape?.result?.ogImage[0]?.url) {
		return scrape.result.ogImage[0].url
	}
	return ''
}

type Props = {
	listId: List['id']
	formState: any
	item?: ListItem
}

export default function ItemFormFields({ listId, formState, item }: Props) {
	const [importing, setImporting] = useState(false)
	const [importError, setImportError] = useState('')

	const [isTransitionPending, startTransition] = useTransition()
	const { pending: isFormPending } = useFormStatus()

	const router = useRouter()

	const titleRef = useRef<HTMLTextAreaElement>(null)
	const notesRef = useRef<HTMLTextAreaElement>(null)

	// Item Fields
	const [scrape, setScrape] = useState<Scrape | undefined>(item?.scrape)
	const [id] = useState<string>(item?.id || '')
	const [title, setTitle] = useState<string>(item?.title || '')
	const [notes, setNotes] = useState<string>(item?.notes || '')
	const [url, setUrl] = useState<string>(item?.url || '')
	const [priority, setPriority] = useState<ItemPriorityType>((item?.priority as ItemPriorityType) || ItemPriority.Normal)
	const [imageUrl, setImageUrl] = useState<string>(item?.image_url || '')

	const isPending = isFormPending || isTransitionPending || importing
	const isDisabled = isPending || title.trim().length === 0

	useEffect(() => {
		if (item || !scrape?.result) return
		if (scrape.result?.ogTitle) setTitle(scrape.result.ogTitle)
		const imageUrl = getImageFromScrape(scrape)
		// console.log('scrape', { scrape })
		setImageUrl(imageUrl)
	}, [item, scrape])

	useEffect(() => {
		if (!item) return
		if (titleRef.current) {
			titleRef.current.style.height = 'inherit'
			titleRef.current.style.height = `${titleRef.current.scrollHeight}px`
		}
	}, [item, title])

	useEffect(() => {
		if (!item) return
		if (notesRef.current) {
			notesRef.current.style.height = 'inherit'
			notesRef.current.style.height = `${notesRef.current.scrollHeight}px`
		}
	}, [item, notes])

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

	const handleChangeUrl = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setUrl(e.target.value)
			if (importError) setImportError('')
		},
		[importError]
	)

	const handleChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setPriority(e.target.value as (typeof ItemPriority)[keyof typeof ItemPriority])
	}, [])

	const handleUrlImport = useCallback(async () => {
		setImporting(true)
		if (importError) setImportError('')
		let data
		try {
			const resp = await fetch(`/api/scraper?url=${url}`)
			data = await resp.json()
		} catch (error) {
			data = error
		} finally {
		}

		if (data?.result?.success) {
			setScrape(data)
		} else {
			setImportError('Sorry. No data found for this URL.')
		}

		setImporting(false)
	}, [importError, url])

	useEffect(() => {
		if (formState?.status === 'success') {
			startTransition(() => {
				setTitle('')
				setNotes('')
				setUrl('')
				setPriority(ItemPriority.Normal)
				setImageUrl('')
				setScrape(undefined)
				router.refresh()
			})
		}
	}, [formState, router])

	return (
		<fieldset disabled={isPending}>
			<input className="input" type="hidden" name="id" value={id} readOnly />
			<input className="input" type="hidden" name="list-id" value={listId} readOnly />
			<input className="input" type="hidden" name="scrape" value={JSON.stringify(scrape || {})} readOnly />
			<input className="input" type="hidden" name="image-url" value={imageUrl} readOnly />

			<div className="flex flex-col justify-between gap-2">
				<div>
					<label className="label">URL</label>
					<div className="flex flex-row justify-between gap-2">
						<input className="input" name="url" type="url" placeholder="Web URL for the item" value={url} onChange={handleChangeUrl} />
						<button type="button" className="nav-btn teal" onClick={handleUrlImport} disabled={!url}>
							{isPending ? (
								<FontAwesomeIcon className="text-xl fa-sharp fa-solid fa-spinner-scale fa-spin-pulse fa-fw" />
							) : (
								<FontAwesomeIcon className="text-xl fa-sharp fa-solid fa-arrow-down-to-line fa-fw" />
							)}
						</button>
					</div>
				</div>

				{importError && <ErrorMessage error={importError} includeTitle={false} />}

				<div>
					<label className="label">Title</label>
					<span className="relative text-red-500 bottom-1">
						<FontAwesomeIcon className="fa-sharp fa-solid fa-asterisk fa-2xs" />
					</span>
					<textarea name="title" placeholder="Something Cool" value={title} rows={1} onChange={handleChangeTitle} ref={titleRef} />
				</div>

				<div>
					<label className="label">Notes</label>
					<textarea name="notes" placeholder="Size: Schmedium" rows={3} value={notes} onChange={handleChangeNotes} ref={notesRef} />
				</div>

				<div>
					<label className="label">Priority</label>
					<select name="priority" value={priority} onChange={handleChangePriority}>
						<option disabled value=""></option>
						{Object.keys(ItemPriority).map((key: any) => (
							<option key={key} value={ItemPriority[key as keyof typeof ItemPriority]}>
								{key}
							</option>
						))}
					</select>
				</div>

				{(scrape || imageUrl) && <ItemImagePicker images={scrape?.result?.ogImage} imageUrl={imageUrl} setImageUrl={setImageUrl} />}

				<div>
					<button type="submit" className="w-full btn blue" disabled={isDisabled}>
						{isPending ? (
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
