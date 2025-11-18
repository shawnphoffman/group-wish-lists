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
	return scrapeUrl(`https://api.shawn.party/api/open-graph/scrape/1?url=${url}`, url, existingData)
}

export const scrapeUrl2 = async (url: string, existingData: ScrapeUrlResult = {}) => {
	return scrapeUrl(`https://api.shawn.party/api/open-graph/scrape/2?url=${url}`, url, existingData)
}

const scrapeUrl = async (scraper: string, url: string, existingData: ScrapeUrlResult = {}) => {
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
			// Only merge if data exists, otherwise use newData directly
			result = existingData ? mergician(existingData, newData) : newData
		} catch (error) {
			console.error('scraper-1 error', error)
			throw new Error('scraper-1 error', { cause: error })
		}
	}
	return result as ScrapeUrlResult
}
