import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		short_name: 'Wish Lists',
		name: 'Group Wish Lists',
		description: 'Sharing wish lists made easy.',
		scope: '/',
		start_url: '/',
		display: 'standalone',
		theme_color: '#FF0000',
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
