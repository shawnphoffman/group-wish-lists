import '@/app/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { Suspense } from 'react'
import { config } from '@fortawesome/fontawesome-svg-core'
import { Analytics } from '@vercel/analytics/react'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
config.autoAddCss = false

import { ThemeProvider } from '@/components/theme-provider'

const defaultUrl = process.env.VERCEL_URL ? `https://hoffstuff.com` : 'http://localhost:3002'

export const viewport: Viewport = {
	themeColor: '#0a0a0a',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	colorScheme: 'dark',
	minimumScale: 1,
	// viewportFit: 'cover'
}

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
		title: 'Wish Lists',
		capable: true,
		statusBarStyle: 'black',
	},
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.className} dark`} style={{ colorScheme: 'dark' }}>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Suspense>
						<main className="flex flex-col items-center px-2 mx-auto h-dvh">{children}</main>
					</Suspense>
					{process.env.VERCEL_ENV && <Analytics />}
				</ThemeProvider>
			</body>
		</html>
	)
}
