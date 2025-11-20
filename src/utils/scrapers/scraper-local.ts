import { mergician } from 'mergician'
import { ScrapeUrlResult } from './scraper'
import { saveScrape } from '@/app/actions/scrapes'

export const scrapeUrlLocal = async (url: string, existingData: ScrapeUrlResult = {}) => {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout

	let result: ScrapeUrlResult | null = null
	let apiData: any = null

	try {
		const apiResp = await fetch(`/api/scraper?url=${url}`, {
			signal: controller.signal,
		})
		apiData = await apiResp.json()
		clearTimeout(timeout)
	} catch (error) {
		console.error('scraper-4.1 error', error)
		throw new Error('scraper-4.1 error', { cause: error })
	}

	if (apiData?.result?.ogImage?.length) {
		if (apiData?.result?.ogPriceAmount) {
			apiData.result.ogPrice = apiData.result.ogPriceAmount
		}

		const savedScrape = await saveScrape({
			url,
			title: apiData.result.ogTitle,
			description: apiData.result.ogDescription,
			price: apiData.result.ogPrice,
			price_currency: apiData.result.ogPriceCurrency,
			scraper_id: 'scraper_local',
			image_urls: apiData.result.ogImage.map((x: { url: string }) => x.url).filter((url): url is string => url != null),
			scrape_result: apiData,
		})
		apiData.result.savedScrape['scraper_local'] = savedScrape.scrape?.data?.id

		result = existingData ? mergician(existingData, apiData) : apiData
	} else {
		result = existingData
	}
	return result as ScrapeUrlResult
}
