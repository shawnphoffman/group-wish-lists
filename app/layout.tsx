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
			<body className="bg-background text-foreground">
				<main className="min-h-screen flex flex-col items-center">{children}</main>
			</body>
			<PrelineScript />
		</html>
	)
}
