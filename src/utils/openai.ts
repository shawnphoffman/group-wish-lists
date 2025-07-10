'use server'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export const cleanTitle = async (title: string) => {
	try {
		const { text } = await generateText({
			model: openai('gpt-4o-mini'),
			prompt: `Clean up the product title text to make it cleaner and more concise. Remove any website titles or excess descriptions. I just want the simple product name. Try to keep it to 5-6 words but a little bit more or less is fine. Normalize it as well to remove all caps and extra spaces: "${title}"`,
		})
		// console.log('cleanTitle', { text })
		return text
	} catch (error) {
		// console.error('Error cleaning title', error)
		return title
	}
}

export const extractProductDetails = async (title: string, description: string) => {
	return {}
}
