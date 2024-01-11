'use client'

import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import ScrapePreview, { Scrape } from './ScrapePreview'

type Props = {
	setScrape: Dispatch<SetStateAction<Scrape | undefined>>
	scrape?: Scrape
}

export default function ScrapeItem({ setScrape, scrape }: Props) {
	const [isLoading, setIsLoading] = useState(false)
	const [importUrl, setImportUrl] = useState<string>()

	const handleChangeImportUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setImportUrl(e.target.value)
	}, [])

	const handleSubmit = async () => {
		setIsLoading(true)
		let data2
		try {
			const resp = await fetch(`/api/scraper?url=${importUrl}`)
			data2 = await resp.json()
			console.log({ data2 })
		} catch (error) {
			data2 = error
		}
		setScrape(data2)
		setIsLoading(false)
	}

	return (
		<div className="flex flex-col gap-1.5 items-stretch p-2">
			<h5>Import from URL</h5>
			<p className="text-gray-300	">Use this to prepopulate your wish list item or enter it manually below.</p>

			<div className="flex flex-row justify-between gap-4">
				<input className="input" name="url" placeholder="URL to Import" onChange={handleChangeImportUrl} disabled={isLoading} />
				<button
					onClick={handleSubmit}
					className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-teal-500 hover:bg-teal-100 hover:text-teal-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-teal-800/30 dark:hover:text-teal-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
					disabled={isLoading}
				>
					<i className="fa-sharp fa-solid fa-link text-xl" aria-hidden />
				</button>
			</div>

			{scrape && <ScrapePreview scrape={scrape} />}
		</div>
	)
}
