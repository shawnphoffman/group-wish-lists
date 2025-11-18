import { mergician } from 'mergician'
import { ScrapeUrlResult } from './scraper'

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
		result = existingData ? mergician(existingData, apiData) : apiData
	} else {
		result = existingData
	}
	return result as ScrapeUrlResult
}
