'use client'

import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import { Scrape } from '../types'
import ScrapePreview from './ScrapePreview'

import './ScrapeUrl.css'

type Props = {
	setScrape: Dispatch<SetStateAction<Scrape | undefined>>
	scrape?: Scrape
}

export default function ScrapeItem({ setScrape, scrape }: Props) {
	const [isLoading, setIsLoading] = useState(false)
	const [importUrl, setImportUrl] = useState<string>('')

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit()
		}
	}, [])

	const handleChangeImportUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setImportUrl(e.target.value)
	}, [])

	const handleSubmit = async () => {
		setIsLoading(true)
		let data
		try {
			const resp = await fetch(`/api/scraper?url=${importUrl}`)
			data = await resp.json()
		} catch (error) {
			data = error
		}
		setScrape(data)
		setIsLoading(false)
		setImportUrl(() => '')
	}

	return (
		<div className="flex flex-col gap-1.5 items-stretch p-2">
			<h5>Import from URL</h5>
			<p className="text-gray-300 ">Use this to prepopulate your wish list item or enter it manually below.</p>

			<div className="flex flex-row justify-between gap-4">
				<input
					className="input"
					name="url"
					type="url"
					placeholder="URL to Import"
					value={importUrl}
					onChange={handleChangeImportUrl}
					disabled={isLoading}
					onKeyDown={handleKeyDown}
				/>
				<button onClick={handleSubmit} className="import-btn" disabled={isLoading}>
					<FontAwesomeIcon className="fa-sharp fa-solid fa-link" />
				</button>
			</div>

			{scrape && <ScrapePreview scrape={scrape} />}
		</div>
	)
}
