import { mergician } from 'mergician'
import { ScrapeUrlResult } from './scraper'

export const scrapeUrlOld = async (url: string, existingData: ScrapeUrlResult = {}) => {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout

	let result: ScrapeUrlResult | null = null
	let apiData: any = null

	try {
		const apiResp = await fetch(`https://api.shawn.party/api/open-graph?scrape=${url}`, {
			signal: controller.signal,
		})
		apiData = await apiResp.json()
		clearTimeout(timeout)
	} catch (error) {
		console.error('scraper-2.1 error', error)
		throw new Error('scraper-2.1 error', { cause: error })
	}
	if (apiData?.og?.image || apiData?.images?.length) {
		try {
			const newData = {
				result: {
					success: true,
					ogUrl: apiData?.meta?.url || apiData?.og?.url,
					ogTitle: apiData?.meta?.title || apiData?.og?.title,
					ogDescription: apiData?.meta?.description || apiData?.og?.description,
					ogType: apiData?.og?.type,
					ogPrice: apiData?.og?.price,
					ogPriceCurrency: apiData?.og?.priceCurrency,
					ogAvailability: apiData?.og?.availability,
					ogSiteName: apiData?.og?.site_name,
					ogImage: [
						{
							url: apiData?.og?.image,
						},
						...apiData?.images?.map((x: { src: string }) => ({ url: x.src })),
					],
				},
			}
			result = existingData ? mergician(existingData, newData) : newData
		} catch (error) {
			console.error('scraper-2.2 error', error)
			throw new Error('scraper-2.2 error', { cause: error })
		}
	} else {
		result = existingData
	}
	return result as ScrapeUrlResult
}
