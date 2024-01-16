import markdownit from 'markdown-it'
import { NextResponse } from 'next/server'

const md = markdownit()

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const markdownString = requestUrl.searchParams.get('raw')

	console.log('markdownString', markdownString)

	if (markdownString) {
		const result = md.parse(markdownString, {})

		if (result) {
			return NextResponse.json(result)
		}
		return NextResponse.json({ error: 'No data found', markdownString })
	}

	return NextResponse.json({ error: 'No markdown provided', markdownString })
}
