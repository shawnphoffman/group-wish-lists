import { mergician } from 'mergician'
import { ScrapeUrlResult } from './scraper'
import { saveScrape } from '@/app/actions/scrapes'

export const scrapeUrlOld = async (url: string, existingData: ScrapeUrlResult = {}) => {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout

	let result: ScrapeUrlResult | null = null
	let apiData: any = null

	try {
		const apiResp = await fetch(`${process.env.NEXT_PUBLIC_OG_SCRAPE_URL}?scrape=${url}`, {
			signal: controller.signal,
		})
		apiData = await apiResp.json()
		clearTimeout(timeout)
	} catch (error) {
		console.error('scraper-3.1 error', error)
		throw new Error('scraper-3.1 error', { cause: error })
	}

	if (apiData?.og?.image || apiData?.images?.length) {
		try {
			const newData = {
				result: {
					savedScrape: {
						scraper_old: null,
					},
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

			const savedScrape = await saveScrape({
				url,
				title: newData.result.ogTitle,
				description: newData.result.ogDescription,
				price: newData.result.ogPrice,
				price_currency: newData.result.ogPriceCurrency,
				scraper_id: 'scraper_old',
				image_urls: newData.result.ogImage.map((x: { url: string }) => x.url).filter((url): url is string => url != null),
				scrape_result: newData,
			})
			newData.result.savedScrape['scraper_old'] = savedScrape.scrape?.data?.id

			result = existingData ? mergician(existingData, newData) : newData
		} catch (error) {
			console.error('scraper-3.2 error', error)
			throw new Error('scraper-3.2 error', { cause: error })
		}
	} else {
		result = existingData
	}
	return result as ScrapeUrlResult
}
