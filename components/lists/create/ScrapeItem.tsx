'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { createItem } from '@/app/actions/items'

import Code from '@/components/Code'
import Input from '@/components/core/Input'
import Label from '@/components/core/InputLabel'
import Select from '@/components/core/Select'
import Textarea from '@/components/core/Textarea'

import { ItemPriority } from '@/utils/enums'

import ScrapePreview, { Scrape } from './ScrapePreview'

async function scrapeUrl(url: string) {
	try {
		const res = await fetch(`/api/scraper?url=${url}`)
		const json = await res.json()
		return json
	} catch (error) {
		return error
	}
}

export default function ScrapeItem({ listId }: { listId: string }) {
	// Item Fields
	const [title, setTitle] = useState<string>('')
	const [notes, setNotes] = useState<string>('')
	const [url, setUrl] = useState<string>('')
	const [priority, setPriority] = useState<(typeof ItemPriority)[keyof typeof ItemPriority] | ''>('')
	const [imageUrl, setImageUrl] = useState<string>('')

	const [state, formAction] = useFormState(createItem, {})

	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [isPending, startTransition] = useTransition()
	const formRef = useRef<HTMLFormElement>(null)

	const handleClick = useCallback(async () => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	useEffect(() => {
		console.log('state', state)
		if (state?.status === 'success') {
			startTransition(() => {
				setIsEditing(() => !isEditing)
				router.refresh()
				if (formRef?.current) {
					// TODO clear the states
				}
			})
		}
	}, [state])

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

	//
	const [isLoading, setIsLoading] = useState(false)
	const [scrape, setScrape] = useState<Scrape>({
		error: false,
		result: {
			ogUrl: '',
			ogTitle: '',
			ogDescription: '',
			ogImage: [],
			ogLocale: '',
			charset: '',
			requestUrl: '',
			success: false,
			error: '',
		},
	})
	const [importUrl, setImportUrl] = useState<string>()

	const handleChangeImportUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setImportUrl(e.target.value)
	}, [])

	const handleSubmit = async () => {
		setIsLoading(true)
		const data = await scrapeUrl(importUrl ?? '')
		setScrape(data)
		setIsLoading(false)
	}

	useEffect(() => {
		if (!scrape?.result) return

		console.log(scrape.result)

		if (scrape.result?.ogTitle) setTitle(scrape.result.ogTitle)
		if (scrape.result?.ogUrl) setUrl(scrape.result.ogUrl)
		if (scrape.result?.ogImage?.length && scrape.result?.ogImage[0]?.url) setImageUrl(scrape.result.ogImage[0].url)
	}, [scrape])

	return (
		<div className="flex flex-col gap-2 items-stretch border border-dashed border-red-400 p-4">
			<h3>Add Item</h3>
			<div className="flex flex-col gap-2 items-stretch border border-dashed border-teal-400 p-4">
				<h4>Import from URL</h4>
				<div className="flex flex-row justify-between gap-4">
					<Input name="url" placeholder="URL to Import" onChange={handleChangeImportUrl} disabled={isLoading} />
					<button
						onClick={handleSubmit}
						className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-teal-500 hover:bg-teal-100 hover:text-teal-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-teal-800/30 dark:hover:text-teal-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
						disabled={isLoading}
					>
						<i className="fa-sharp fa-solid fa-link text-xl" aria-hidden />
					</button>
				</div>
				{scrape && <ScrapePreview scrape={scrape} />}
				{/* {scrape && <Code code={JSON.stringify(scrape, null, 2)} />} */}
			</div>

			<div className="flex flex-col gap-2 items-stretch border border-dashed border-purple-400 p-4">
				<h4>Item Details</h4>

				<form action={formAction} ref={formRef}>
					<Input type="hidden" name="list-id" value={listId} readOnly />
					<Input type="hidden" name="scrape" value={JSON.stringify(scrape || {})} readOnly />

					<div className="flex flex-col justify-between gap-2">
						<div>
							<Label>Title</Label>
							<Input type="text" name="title" placeholder="Something Cool" value={title} onChange={handleChangeTitle} />
						</div>

						<div>
							<Label>URL</Label>
							<Input type="url" name="url" placeholder="https://wow.cool/" value={url} onChange={handleChangeUrl} />
						</div>

						<div>
							<Label>Notes</Label>
							<Textarea name="notes" placeholder="Size: Schmedium" rows={3} value={notes} onChange={handleChangeNotes} />
						</div>

						<div>
							<Label>Priority</Label>
							{/* <Select name="priority" defaultValue={ItemPriority.Normal}> */}
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
							<button
								type="submit"
								onClick={handleClick}
								className="py-2 px-3 w-full justify-center inline-flex items-center mt-2 gap-x-2 text-lg font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
							>
								<span className="drop-shadow-lg ">Save</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
