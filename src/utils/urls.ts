const commonDomains = {
	'a.co': 'Amazon',
	amazon: 'Amazon',
	etsy: 'Etsy',
	facebook: 'Facebook',
	shopify: 'Shopify',
	jcrew: 'J.Crew',
	loft: 'Loft',
}

export function getDomainFromUrl(url: string): string {
	try {
		let domain: string
		const parsedUrl = new URL(url)
		const parts = parsedUrl.hostname?.split('.') || []
		if (parts.length > 2) {
			domain = parts.slice(-2).join('.') // Returns the last two segments (e.g., example.com)
		} else {
			domain = parsedUrl.hostname // Return as is for domains without subdomains
		}
		if (domain) {
			// console.log('domain', domain)
			const temp = Object.keys(commonDomains).find(x => {
				// console.log('x', x)
				return domain.includes(x)
			})
			return temp ? commonDomains[temp] : domain
		}
		return ''
	} catch (error) {
		console.error('Invalid URL:', error)
		return ''
	}
}
