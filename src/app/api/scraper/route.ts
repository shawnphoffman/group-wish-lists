import { NextResponse } from 'next/server'
import ogs from 'open-graph-scraper'

const UserAgents = {
	FacebookBot: 'facebookexternalhit/1.1',
	Generic: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
	GoogleBot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
}

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const url = requestUrl.searchParams.get('url')

	if (url) {
		let output: any = {}

		// Loop over the possible UserAgents to see if we get a match
		for (const userAgent of Object.entries<string>(UserAgents)) {
			try {
				const { error, result } = await ogs({
					url,
					// onlyGetOpenGraphInfo: true,
					fetchOptions: {
						// signal: AbortSignal.timeout(15000),
						headers: { 'user-agent': userAgent[1] },
					},
				})

				if (error || !result || !result.success) {
					console.error('⚠️ error', { error, result, userAgent, url })
					continue
				}

				output = {
					...result,
				}

				if (!result.ogTitle || !result.ogImage?.length) {
					console.error('💲 incomplete', { result, userAgent, url, output })
					continue
				}

				// console.log('✅ success', { result, userAgent, url, output })
				console.log('✅ success')

				return NextResponse.json({ result: output, userAgent: userAgent[0] })
			} catch (ex) {
				console.error('⛔ catch', { ex, userAgent, url })
			}
		}

		if (output?.ogTitle) {
			console.log('✅ mixed-success', { output, url })
			return NextResponse.json({ result: output, userAgent: 'mix' })
		}

		return NextResponse.json({ error: 'No data found', url })
	}

	return NextResponse.json({ error: 'No URL provided', url })
}
