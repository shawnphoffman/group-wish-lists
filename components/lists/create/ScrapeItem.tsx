'use client'

import { useCallback, useState } from 'react'

import Code from '@/components/Code'
import Input from '@/components/core/Input'

import ScrapePreview, { Scrape } from './ScrapePreview'

async function scrapeUrl(url: string) {
	try {
		const res = await fetch(`/api/scraper?url=${url}`)
		return await res.json()
	} catch (error) {
		return {}
	}
}

export default function ScrapeItem() {
	const [isLoading, setIsLoading] = useState(false)
	const [scrape, setScrape] = useState()
	const [url, setUrl] = useState<string>()

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value)
	}, [])

	const handleSubmit = async () => {
		setIsLoading(true)
		const data = await scrapeUrl(url ?? '')
		console.log(data)
		setScrape(data)
		setIsLoading(false)
	}

	return (
		<div className="flex flex-col gap-2 items-stretch border border-dashed border-red-400 p-4">
			<h3>Add Item</h3>
			<div className="flex flex-col gap-2 items-stretch border border-dashed border-teal-400 p-4">
				<h4>Import from URL</h4>
				<div className="flex flex-row justify-between gap-4">
					<Input name="url" placeholder="URL to Import" onChange={handleChange} disabled={isLoading} />
					<button
						onClick={handleSubmit}
						className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-teal-500 hover:bg-teal-100 hover:text-teal-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-teal-800/30 dark:hover:text-teal-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
						disabled={isLoading}
					>
						<i className="fa-sharp fa-solid fa-link text-xl" aria-hidden />
					</button>
				</div>
				{scrape && <ScrapePreview scrape={scrape} />}
				{scrape && <Code code={JSON.stringify(scrape, null, 2)} />}
			</div>

			<div className="flex flex-col gap-2 items-stretch border border-dashed border-purple-400 p-4">
				<h4>Item Details</h4>

				<div className="flex flex-col justify-between gap-4">
					<div className="flex flex-row justify-between gap-4">
						<Input name="title" placeholder="Title" />
					</div>
				</div>
			</div>
		</div>
	)
}
