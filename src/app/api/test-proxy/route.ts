import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { url } = body

		if (!url) {
			return NextResponse.json({ error: 'URL is required' }, { status: 400 })
		}

		const res = await fetch('https://flaresolverr.lan.goober.house/v1', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				cmd: 'request.get',
				url: url,
				maxTimeout: 60000,
			}),
		})

		const data = await res.json()

		// Return response with CORS headers
		return NextResponse.json(data, {
			status: res.status,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		})
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'An error occurred' },
			{
				status: 500,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			}
		)
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	})
}
