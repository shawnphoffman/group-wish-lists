import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		short_name: 'Wish Lists',
		name: 'Group Wish Lists',
		description: 'Sharing wish lists made easy.',
		icons: [
			{
				src: '/apple-icon.png',
				type: 'image/png',
				sizes: 'any',
			},
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon',
			},
			{
				src: '/icon.png',
				type: 'image/png',
				sizes: 'any',
			},
		],
		scope: '/',
		start_url: '/',
		display: 'minimal-ui',
		shortcuts: [
			{
				name: 'My Stuff',
				short_name: 'My Stuff',
				description: 'My lists, purchases, and profile info',
				url: '/me?source=pwa',
			},
		],
	}
}
