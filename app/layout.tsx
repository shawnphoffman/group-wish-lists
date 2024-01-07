import { GeistSans } from 'geist/font/sans'

import PrelineScript from '@/components/PrelineScript'

import './globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Wish Lists',
	description: 'Sharing wish lists made easy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={GeistSans.className}>
			<head>
				<script src="https://kit.fontawesome.com/166b274226.js" crossOrigin="anonymous"></script>
			</head>
			<body className="dark:bg-gray-950 dark:text-white">
				<main className="container mx-auto min-h-screen flex flex-col items-center">{children}</main>
			</body>
			<PrelineScript />
		</html>
	)
}
