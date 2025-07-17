import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		short_name: 'Wish Lists',
		name: 'Group Wish Lists',
		description: 'Sharing wish lists made easy.',
		scope: process.env.VERCEL_URL ? 'https://hoffstuff.com' : 'http://localhost:3002',
		start_url: process.env.VERCEL_URL ? 'https://hoffstuff.com' : 'http://localhost:3002',
		display: 'standalone',
		// theme_color: '#FF0000',
		theme_color: '#000000',
		shortcuts: [
			{
				name: 'My Stuff',
				short_name: 'My Stuff',
				description: 'My lists, purchases, and profile info',
				url: `/me`,
			},
		],
	}
}
