// import { createClient } from '@/utils/supabase/server'
// import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import ogs from 'open-graph-scraper'

const userAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
// const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'

// URLs
// https://www.amazon.com/Purina-Friskies-Pate-Adult-Variety/dp/B002CJARMI?pd_rd_w=ZgbFF&content-id=amzn1.sym.80b2efcb-1985-4e3a-b8e5-050c8b58b7cf&pf_rd_p=80b2efcb-1985-4e3a-b8e5-050c8b58b7cf&pf_rd_r=X9AK7HYA2E5FA4QPZ15X&pd_rd_wg=p6yd0&pd_rd_r=fc1a5c6e-3d69-417d-82ad-54bc67d33c8b&pd_rd_i=B002CJARMI&ref_=pd_bap_d_grid_rp_0_1_ec_pd_gwd_bag_pd_gw_rp_1_i&th=1

// TODO process the URL and return the appropriate data

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const url = requestUrl.searchParams.get('url')

	if (url) {
		// await supabase.auth.exchangeCodeForSession(code)
		const { error, result } = await ogs({
			url,
			// onlyGetOpenGraphInfo: true,
			fetchOptions: {
				headers: { 'user-agent': userAgent },
			},
		})
		// console.log(error, result)
		return NextResponse.json({ error, result })
	}

	return NextResponse.json({ error: 'No URL provided' })

	// // URL to redirect to after sign in process completes
	// return NextResponse.redirect(requestUrl.origin)
}
