import { saveScrape } from '@/app/actions/scrapes'
import { mergician } from 'mergician'

export type ScrapeUrlResult = {
	result?: {
		success: boolean
		ogUrl?: string
		ogTitle?: string
		ogDescription?: string
		ogType?: string
		ogSiteName?: string
		ogPrice?: string
		ogPriceCurrency?: string
		ogAvailability?: string
		ogImage?: { url: string }[]
	}
}

export const scrapeUrl1 = async (url: string, existingData: ScrapeUrlResult = {}) => {
	return scrapeUrl(`${process.env.NEXT_PUBLIC_SCRAPE_URL_1}?url=${url}`, url, existingData, 'scraper_1')
}

export const scrapeUrl2 = async (url: string, existingData: ScrapeUrlResult = {}) => {
	return scrapeUrl(`${process.env.NEXT_PUBLIC_SCRAPE_URL_2}?url=${url}`, url, existingData, 'scraper_2')
}

const scrapeUrl = async (scraper: string, url: string, existingData: ScrapeUrlResult = {}, scraperId: string) => {
	let result: ScrapeUrlResult | null = null
	let apiData: any = null
	const resp2 = await fetch(scraper, {
		// signal: ctr.signal,
	})
	apiData = await resp2.json()
	if (apiData?.og?.['og:image'] || apiData?.images?.length) {
		const ogUrl = apiData.meta.url || apiData.og?.['og:url']
		// If og:url does not look like an absolute URL, use original "url" instead
		let resolvedOgUrl = ogUrl
		try {
			new URL(ogUrl)
			// If the constructor doesn't throw, use ogUrl as is
		} catch {
			// ogUrl is not a valid absolute URL, fall back to original url variable
			resolvedOgUrl = url
		}

		try {
			const newData = {
				result: {
					savedScrape: {
						[scraperId]: null,
					},
					success: true,
					ogUrl: resolvedOgUrl,
					ogTitle: apiData.meta.title || apiData.og?.['og:title'],
					ogDescription: apiData.meta.description || apiData.og?.['og:description'],
					ogType: apiData.og?.['og:type'],
					ogSiteName: apiData.og?.['og:site_name'],
					ogPrice: apiData.og?.['og:price:amount'],
					ogPriceCurrency: apiData.og?.['og:price:currency'],
					ogAvailability: apiData.og?.['og:availability'],
					ogImage: [
						{
							url: apiData.og?.['og:image'],
						},
						...apiData.images.map((x: { src: string }) => ({ url: x.src })),
					],
				},
			}

			const savedScrape = await saveScrape({
				url,
				title: newData.result.ogTitle,
				description: newData.result.ogDescription,
				price: newData.result.ogPrice,
				price_currency: newData.result.ogPriceCurrency,
				scraper_id: scraperId,
				image_urls: newData.result.ogImage.map((x: { url: string }) => x.url).filter((url): url is string => url != null),
				scrape_result: newData,
			})
			newData.result.savedScrape[scraperId] = savedScrape.scrape?.data?.id

			// Only merge if data exists, otherwise use newData directly
			result = existingData ? mergician(existingData, newData) : newData
		} catch (error) {
			console.error('scrapeUrl error', error)
			throw new Error('scrapeUrl error', { cause: error })
		}
	}
	return result as ScrapeUrlResult
}
