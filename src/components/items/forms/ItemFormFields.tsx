'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { faArrowsRotate, faAsterisk, faSpinnerScale } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
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
import { cleanTitle } from '@/utils/openai'

import ItemImage from '../components/ItemImage'
import ItemImagePicker from '../components/ItemImagePicker'
import MarkdownBlock from '../components/MarkdownBlock'
import SuccessMessage from '@/components/common/SuccessMessage'
import PlainMessage from '@/components/common/PlainMessage'
import { scrapeUrl1, scrapeUrl2 } from '@/utils/scrapers/scraper'
import { scrapeUrlOld } from '@/utils/scrapers/scraper-old'
import { scrapeUrlLocal } from '@/utils/scrapers/scraper-local'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
// import ItemTagsClient from '../components/ItemTagsClient'

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
	const [importMessage, setImportMessage] = useState('')
	const [importSuccess, setImportSuccess] = useState('')

	const [isTransitionPending, startTransition] = useTransition()
	const { pending: isFormPending } = useFormStatus()

	const router = useRouter()

	const titleRef = useRef<HTMLTextAreaElement>(null)
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
	const [quantity, setQty] = useState<number>(item?.quantity || 1)
	// const [tags, setTags] = useState<Tag[]>(item?.tags?.map(t => ({ id: t, text: t })) || [])
	// const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
	// const [tagsInput, setTagsInput] = useState<string>('')

	const isPending = isFormPending || isTransitionPending || importing
	const isDisabled = isPending || title.trim().length === 0

	// ==============================
	// MEMOS
	// ==============================

	// const tagsInput = useMemo(() => {
	// 	return tags.map(t => t.text).join(', ')
	// }, [tags])

	// ==============================
	// EFFECTS
	// ==============================

	useEffect(() => {
		if (!scrape?.result) return
		if (scrape.result?.ogTitle && !item?.title?.trim().length) setTitle(scrape.result.ogTitle)
		if (scrape.result?.ogPrice) setPrice(scrape.result.ogPrice)

		if (!item) {
			const imageUrl = getImageFromScrape(scrape)
			setImageUrl(imageUrl)
		}
	}, [item, scrape])

	useEffect(() => {
		if (!item) return
		if (notesRef.current) {
			notesRef.current.style.height = 'inherit'
			notesRef.current.style.height = `${notesRef.current.scrollHeight}px`
		}
	}, [item, notes])

	useEffect(() => {
		if (titleRef.current) {
			titleRef.current.style.height = 'inherit'
			titleRef.current.style.height = `${titleRef.current.scrollHeight}px`
		}
	}, [title])

	useEffect(() => {
		if (formState?.status === 'success') {
			startTransition(() => {
				setTitle('')
				setNotes('')
				setUrl('')
				setPriority(ItemPriority.Normal)
				setImageUrl('')
				setPrice('')
				setQty(1)
				// setTags([])
				setScrape(undefined)
				setImportError('')
				setImportMessage('')
				setImportSuccess('')
				if (pathname === '/import') {
					router.push(`/lists/${listId}/edit`)
				} else {
					router.refresh()
				}
			})
		}
	}, [formState, listId, pathname, router])

	// ==============================
	// HANDLERS
	// ==============================

	const handleChangeTitle = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

	const handleChangeQuantity = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setQty(Number(e.target.value))
	}, [])

	const handleChangeImageUrl = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setImageUrl(e.target.value)
	}, [])

	const handleChangeUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value)
		setImportError('')
		setImportMessage('')
		setImportSuccess('')
	}, [])

	const handleChangePriority = useCallback(value => {
		setPriority(value as (typeof ItemPriority)[keyof typeof ItemPriority])
	}, [])

	const handleUrlImport = useCallback(async () => {
		setImporting(true)
		setImportError('')
		setImportMessage('')
		setImportSuccess('')
		let data: any = {}

		try {
			// SCRAPE 1 ==============================
			if (process.env.NEXT_PUBLIC_SCRAPE_URL_1) {
				try {
					setImportMessage('Scraping attempt #1...')
					data = await scrapeUrl1(url, data)
				} catch (e) {
					console.error('scrape error 1', e)
				}
			}
			if ((data?.result?.ogImage?.length || 0) < 2) {
				// SCRAPE 2 ==============================
				if (process.env.NEXT_PUBLIC_SCRAPE_URL_2) {
					try {
						setImportMessage('Scraping attempt #2...')
						data = await scrapeUrl2(url, data)
					} catch (e) {
						console.error('scrape error 2', e)
					}
				}
				if ((data?.result?.ogImage?.length || 0) < 2) {
					// SCRAPE 3 ==============================
					if (process.env.NEXT_PUBLIC_OG_SCRAPE_URL) {
						try {
							setImportMessage('Scraping attempt #3...')
							data = await scrapeUrlOld(url, data)
						} catch (e) {
							console.error('scrape error 3', e)
						}
					}
					if ((data?.result?.ogImage?.length || 0) < 2) {
						// SCRAPE 4 ==============================
						try {
							setImportMessage('Scraping attempt #4 💀...')
							data = await scrapeUrlLocal(url, data)
						} catch (e) {
							console.error('scrape error 4', e)
						}
					}
				}
			}
		} catch (error) {
			console.log('scrape error 0', error)
			data = error
		} finally {
			if (data?.result?.success) {
				setImportError('')
			}
		}

		// AI Cleanup
		if (data?.result?.success) {
			if (data.result.ogTitle) {
				try {
					setImportMessage('Cleaning scraped data...')
					const controller = new AbortController()
					const timeout = setTimeout(() => controller.abort(), 5000)

					const cleanedTitle = await Promise.race([
						cleanTitle(data.result.ogTitle),
						new Promise(resolve => {
							setTimeout(() => {
								// If timed out, resolve with original title
								resolve(data.result.ogTitle)
							}, 5000)
						}),
					])
					data.result.ogTitle = cleanedTitle

					// TODO - Try to extract more from the scrape data like size, color, description, price, etc.

					clearTimeout(timeout)
				} catch (error) {
					// Continue with original title if cleaning times out
					console.log('Title cleaning timed out')
				}
			}

			setImportMessage('')
			setImportSuccess(
				"We tried our best. If things don't look right, try again a little bit later or manually enter the information below."
			)
			// TODO - Save the scrape data to the database
			setScrape(data)
		} else {
			// TODO - Save the scrape data to the database
			setImportError('Sorry. No data found for this URL. Maybe try again later?')
			setImportMessage('')
			setImportSuccess('')
		}

		setImporting(false)
	}, [url])

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

	const handleBlurUrl = useCallback(() => {
		if (url && url.length > 0 && !scrape) {
			handleUrlImport()
		}
	}, [url, scrape, handleUrlImport])

	// ==============================
	// RENDER
	// ==============================

	return (
		<fieldset disabled={isPending}>
			<input className="input" type="hidden" name="id" value={id} readOnly />
			<input className="input" type="hidden" name="list-id" value={listId} readOnly />
			<input className="input" type="hidden" name="scrape" value={JSON.stringify(scrape || {})} readOnly />
			<input className="input" type="hidden" name="image-url" value={imageUrl} readOnly />
			{/* <input className="input" type="hidden" name="tags" value={tagsInput} readOnly /> */}

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
							onBlur={handleBlurUrl}
						/>
						<Button
							type="button"
							variant="outline"
							className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
							onClick={handleUrlImport}
							disabled={!url}
							title="Import"
						>
							{importing ? (
								<FontAwesomeIcon size="xl" icon={faSpinnerScale} spinPulse fixedWidth />
							) : (
								<FontAwesomeIcon size="xl" icon={faArrowsRotate} fixedWidth />
							)}
						</Button>
					</div>
				</div>

				{importError && <ErrorMessage error={importError} includeTitle={false} />}
				{importMessage && <PlainMessage message={importMessage} />}
				{importSuccess && <SuccessMessage message={importSuccess} includeTitle={false} />}

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
						ref={titleRef}
					/>
				</div>

				<div className="flex flex-col items-center gap-2">
					<div className="grid w-full gap-1.5 col-span-2">
						<Label htmlFor="notes">Notes</Label>
						<div className="grid ">
							<Textarea name="notes" placeholder="Size: Schmedium" rows={3} value={notes} onChange={handleChangeNotes} ref={notesRef} />
						</div>
					</div>
					{notes && (
						<div className="flex flex-col w-full gap-1.5">
							<Label htmlFor="notes">Preview</Label>
							<div className="grid ">
								<div className="inline px-3 py-2 text-sm border rounded-md text-foreground/75 border-input bg-background/50">
									<MarkdownBlock>{notes}</MarkdownBlock>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<div className="grid w-full gap-1.5">
						<Label htmlFor="priority">Priority</Label>
						<Select name="priority" value={priority} onValueChange={handleChangePriority}>
							<SelectTrigger className="h-10">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.keys(ItemPriority).map((key: any) => (
									<SelectItem key={key} value={ItemPriority[key as keyof typeof ItemPriority]} className="cursor-pointer">
										{key}
										<ItemPriorityIcon priority={ItemPriority[key as keyof typeof ItemPriority]} className="ml-1 text-sm" />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid w-full gap-1.5">
						<Label htmlFor="price">Price Range</Label>
						<Input name="price" placeholder="$1" value={price} onChange={handleChangePrice} />
					</div>

					<div className="grid w-full gap-1.5">
						<Label htmlFor="quantity">Quantity</Label>
						<Input name="quantity" placeholder="1" type="number" min={0} step={1} value={quantity} onChange={handleChangeQuantity} />
					</div>
				</div>

				{/* <ItemTagsClient /> */}

				{/* <div className="grid w-full gap-1.5 text-destructive">
					<Label htmlFor="tags">Tags</Label>
					<TagInput
						placeholder="Add some tags"
						tags={tags}
						sortTags={true}
						allowDuplicates={false}
						setTags={newTags => {
							setTags(newTags)
						}}
						activeTagIndex={activeTagIndex}
						setActiveTagIndex={setActiveTagIndex}
						styleClasses={{
							inlineTagsContainer: 'min-h-[42px]',
							input: 'w-full text-base',
							tag: {
								body: 'pl-2 bg-muted',
							},
						}}
						size="sm"
					/>
				</div> */}

				{scrape?.result && (
					<>
						<div>
							<Button variant={'secondary'} type="submit" className="w-full" disabled={isDisabled}>
								{importing ? (
									<span className="drop-shadow-lg">Importing URL...</span>
								) : isPending ? (
									<span className="drop-shadow-lg">{item ? 'Saving' : 'Adding'}...</span>
								) : (
									<span className="drop-shadow-lg">{item ? 'Save Changes' : 'Add Item'}</span>
								)}
							</Button>
						</div>
						<ItemImagePicker images={scrape?.result?.ogImage} imageUrl={imageUrl} setImageUrl={setImageUrl} />
					</>
				)}

				<div className="grid w-full gap-1.5">
					<Label htmlFor="image-url-manual" className="italic">
						Image URL (Manual Entry)
					</Label>
					<div className="flex flex-row gap-2">
						<Textarea name="image-url-manual" rows={1} value={imageUrl} onChange={handleChangeImageUrl} className="min-h-fit" />
						{imageUrl && <ItemImage className="hidden sm:block max-w-32" url={imageUrl} />}
					</div>
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
