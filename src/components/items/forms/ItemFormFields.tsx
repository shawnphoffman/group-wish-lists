'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { faArrowDownToLine, faAsterisk, faSpinnerScale } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import ErrorMessage from '@/components/common/ErrorMessage'
import { List, ListItem, ScrapeResponse } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ItemPriority, ItemPriorityType } from '@/utils/enums'

import ItemImagePicker from '../components/ItemImagePicker'

export const getImageFromScrape = (scrape?: ScrapeResponse) => {
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
	const searchParams = useSearchParams()
	const importUrl = searchParams.get('url')

	const pathname = usePathname()

	const [importing, setImporting] = useState(false)
	const [importError, setImportError] = useState('')

	const [isTransitionPending, startTransition] = useTransition()
	const { pending: isFormPending } = useFormStatus()

	const router = useRouter()

	const notesRef = useRef<HTMLTextAreaElement>(null)

	// Item Fields
	const [scrape, setScrape] = useState<ScrapeResponse | undefined>(item?.scrape)
	const [id] = useState<string>(item?.id || '')
	const [title, setTitle] = useState<string>(item?.title || '')
	const [notes, setNotes] = useState<string>(item?.notes || '')
	const [price, setPrice] = useState<string>(item?.price || '')
	const [url, setUrl] = useState<string>(item?.url || importUrl || '')
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

	const handleChangePrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setPrice(e.target.value)
	}, [])

	const handleChangeImageUrl = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setImageUrl(e.target.value)
	}, [])

	const handleChangeUrl = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setUrl(e.target.value)
			if (importError) setImportError('')
		},
		[importError]
	)

	const handleChangePriority = useCallback(value => {
		setPriority(value as (typeof ItemPriority)[keyof typeof ItemPriority])
	}, [])

	const handleUrlImport = useCallback(async () => {
		setImporting(true)
		if (importError) setImportError('')
		let data

		const controller = new AbortController()
		const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout

		let apiData: any = null
		try {
			try {
				const apiResp = await fetch(`https://api.shawn.party/api/open-graph?scrape=${url}`, {
					signal: controller.signal,
				})
				apiData = await apiResp.json()
				clearTimeout(timeout)
			} catch (error) {
				if ((error as Error).name === 'AbortError') {
					setImportError('Request timeout. Trying something else...')
				}
			}
			if (apiData?.og?.image || apiData?.images?.length) {
				data = {
					result: {
						success: true,
						ogUrl: apiData.meta.url || apiData.og.url,
						ogTitle: apiData.meta.title || apiData.og.title,
						ogDescription: apiData.meta.description || apiData.og.description,
						ogType: apiData.og.type,
						ogSiteName: apiData.og.site_name,
						ogImage: [
							{
								url: apiData.og.image,
							},
							...apiData.images.map((x: { src: string }) => ({ url: x.src })),
						],
					},
				}
			} else {
				const resp = await fetch(`/api/scraper?url=${url}`)
				data = await resp.json()
				if (!data?.result?.ogImage?.length) {
					const resp2 = await fetch(`https://api.shawn.party/api/open-graph/scrape?url=${url}`)
					data = await resp2.json()
				}
			}
		} catch (error) {
			data = error
		} finally {
			if (data?.result?.success) {
				setImportError('')
			}
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
				if (pathname === '/import') {
					router.push(`/lists/${listId}/edit`)
				} else {
					router.refresh()
				}
			})
		}
	}, [formState, listId, pathname, router])

	const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
		event.preventDefault()

		// Get the pasted text
		const pastedText = event.clipboardData.getData('Text')

		// Find the first URL in the pasted text
		const urlPattern = /(https?:\/\/[^\s]+)/g
		const match = urlPattern.exec(pastedText)
		const firstURL = match ? match[0] : ''

		// Update the state with the found URL
		setUrl(() => firstURL)
	}, [])

	return (
		<fieldset disabled={isPending}>
			<input className="input" type="hidden" name="id" value={id} readOnly />
			<input className="input" type="hidden" name="list-id" value={listId} readOnly />
			<input className="input" type="hidden" name="scrape" value={JSON.stringify(scrape || {})} readOnly />
			<input className="input" type="hidden" name="image-url" value={imageUrl} readOnly />

			<div className="flex flex-col justify-between gap-2">
				<div className="grid items-center w-full gap-2">
					<Label htmlFor="email">URL</Label>
					<div className="flex flex-row justify-between gap-2">
						<Input
							className="select-all input"
							name="url"
							type="url"
							placeholder="Web URL for the item"
							value={url}
							onChange={handleChangeUrl}
							onPaste={handlePaste}
							onFocus={event => event.target.select()}
						/>
						<Button
							type="button"
							variant="outline"
							className="text-teal-400 hover:text-teal-300"
							onClick={handleUrlImport}
							disabled={!url}
							title="Import"
						>
							<span className="hidden sm:flex">Import</span>
							{importing ? (
								<FontAwesomeIcon size="xl" icon={faSpinnerScale} spinPulse fixedWidth />
							) : (
								<FontAwesomeIcon size="xl" icon={faArrowDownToLine} fixedWidth />
							)}
						</Button>
					</div>
				</div>

				{importError && <ErrorMessage error={importError} includeTitle={false} />}

				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="title">
						Title
						<span className="relative text-xs text-red-500 bottom-1">
							<FontAwesomeIcon icon={faAsterisk} />
						</span>
					</Label>
					<Textarea
						name="title"
						placeholder="Something cool..."
						rows={1}
						value={title}
						onChange={handleChangeTitle}
						className="min-h-fit"
					/>
				</div>

				<div className="grid w-full gap-1.5">
					<Label htmlFor="notes">Notes</Label>
					<Textarea name="notes" placeholder="Size: Schmedium" rows={3} value={notes} onChange={handleChangeNotes} ref={notesRef} />
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<div className="grid w-full gap-1.5">
						<Label htmlFor="priority">Priority</Label>
						<Select name="priority" value={priority} onValueChange={handleChangePriority}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.keys(ItemPriority).map((key: any) => (
									<SelectItem key={key} value={ItemPriority[key as keyof typeof ItemPriority]}>
										{key}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid w-full gap-1.5">
						<Label htmlFor="price">Price Range</Label>
						<Input name="price" placeholder="$1" value={price} onChange={handleChangePrice} />
					</div>
				</div>

				{(scrape || imageUrl) && (
					<>
						<div>
							<Button variant={'secondary'} type="submit" className="w-full" disabled={isDisabled}>
								{importing ? (
									<span className="drop-shadow-lg ">Importing URL...</span>
								) : isPending ? (
									<span className="drop-shadow-lg ">{item ? 'Saving' : 'Adding'}...</span>
								) : (
									<span className="drop-shadow-lg ">{item ? 'Save Changes' : 'Add Item'}</span>
								)}
							</Button>
						</div>
						<ItemImagePicker images={scrape?.result?.ogImage} imageUrl={imageUrl} setImageUrl={setImageUrl} />
					</>
				)}

				<div className="grid w-full gap-1.5 text-muted-foreground">
					<Label htmlFor="image-url-manual" className="italic">
						Image URL (Manual)
					</Label>
					<Textarea name="image-url-manual" rows={1} value={imageUrl} onChange={handleChangeImageUrl} className="min-h-fit" />
				</div>

				<div>
					<Button variant={'secondary'} type="submit" className="w-full" disabled={isDisabled}>
						{importing ? (
							<span className="drop-shadow-lg ">Importing URL...</span>
						) : isPending ? (
							<span className="drop-shadow-lg ">{item ? 'Saving' : 'Adding'}...</span>
						) : (
							<span className="drop-shadow-lg ">{item ? 'Save Changes' : 'Add Item'}</span>
						)}
					</Button>
				</div>
			</div>
		</fieldset>
	)
}
