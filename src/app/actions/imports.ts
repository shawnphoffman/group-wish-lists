'use server'

export const importAmazonList = async (url: string) => {
	'use server'

	const resp = await fetch(url)
	const html = await resp.text()

	console.clear()
	console.log('resp', html)

	// console.log('gift', gift)

	return {
		html,
	}
}
