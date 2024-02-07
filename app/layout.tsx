import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { Suspense } from 'react'

import '@/app/globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://hoffstuff.com` : 'http://localhost:3000'

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Wish Lists',
	description: 'Sharing wish lists made easy.',
	openGraph: {
		title: 'Wish Lists',
		description: 'Sharing wish lists made easy.',
		type: 'website',
		url: '/',
		locale: 'en_US',
	},
	appleWebApp: {
		statusBarStyle: 'black-translucent',
		title: 'Wish Lists',
	},
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={GeistSans.className}>
			<head>
				<script src="https://kit.fontawesome.com/166b274226.js" crossOrigin="anonymous" async></script>
			</head>
			<body>
				<Suspense>
					<main className="container flex flex-col items-center mx-auto h-dvh">{children}</main>
				</Suspense>
			</body>
		</html>
	)
}
