'use client'

import { useEffect } from 'react'

export default function HashScroller() {
	useEffect(() => {
		const scrollToHash = () => {
			const hash = window.location.hash
			if (hash) {
				setTimeout(() => {
					const elementId = hash.startsWith('#') ? hash.substring(1) : hash
					const element = document.getElementById(elementId)
					// console.log('scrolling to hash', { hash, element })
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' })
					} else {
						setTimeout(scrollToHash, 500)
					}
				}, 500)
			}
		}

		scrollToHash()
	}, [])

	return null
}
