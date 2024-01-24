import markdownit, { Token } from 'markdown-it'
import { NextResponse } from 'next/server'

const md = markdownit()

function cleanItemList(items: any[]) {
	const cleanedItems = []

	for (let i = 0; i < items.length; i++) {
		const currentItem = items[i]

		const startsWithBracket = currentItem.content.startsWith('[ ]')
		const isLevel3 = currentItem.level === 3

		// Check if the content starts with "[ ]"
		if ((startsWithBracket || isLevel3) && !currentItem.content.startsWith('[x]')) {
			const parentItem = {
				title: currentItem.content.substring(startsWithBracket ? 4 : 0).trim(),
				notes: '', // Initialize notes for the parent
			}

			// Check if the content of the parent item contains "\n"
			const newlineIndex = parentItem.title.indexOf('\n')
			if (newlineIndex !== -1) {
				// Split the content by all occurrences of "\n"
				const parts = parentItem.title.split('\n')

				// Include only the content prior to the first "\n" in the parent output
				parentItem.title = parts[0].trim()

				// Join all subsequent parts after "\n" and add to the notes
				parentItem.notes = parts.slice(1).join(' ').trim()
			}

			// Look for the next item with a higher level and non-empty content
			for (let j = i + 1; j < items.length; j++) {
				const childItem = items[j]
				if (childItem.content.startsWith('[x]')) {
					break
				}
				if (childItem.level > currentItem.level && childItem.content.trim() !== '') {
					// Add the child item's content as the notes to the parent
					parentItem.notes = childItem.content.trim()
					i = j // Move the index to the next item after the notes
					break
				}
			}

			cleanedItems.push(parentItem)
		}
	}

	return cleanedItems
}

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const markdownString = requestUrl.searchParams.get('raw')

	// console.log('markdownString', markdownString)

	if (markdownString) {
		const result = md.parse(markdownString, {})

		if (!result) {
			return NextResponse.json({ error: 'No data found', markdownString })
		}

		const clean = result.reduce((acc: any[], curr: Token) => {
			if (curr.content === '') return acc

			const cleanCurr: Partial<Token> = {
				...curr,
			}
			cleanCurr.children = undefined
			cleanCurr.map = undefined

			acc.push(cleanCurr)

			return acc
		}, [])

		const clean2 = cleanItemList(clean)

		return NextResponse.json(clean2)
	}

	return NextResponse.json({ error: 'No markdown provided', markdownString })
}
