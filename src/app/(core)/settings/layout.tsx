import { Suspense } from 'react'

import { FallbackRowThick } from '@/components/common/Fallbacks'

import SettingsLinks from './links'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col w-full max-w-4xl animate-page-in">
			<main className="flex flex-col flex-1 gap-6 px-2">
				<div className="grid w-full max-w-6xl gap-2 mx-auto">
					<h1>Settings</h1>
				</div>
				<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
					<nav className="grid gap-4 text-sm text-muted-foreground">
						<SettingsLinks />
					</nav>
					<Suspense fallback={<FallbackRowThick />}>{children}</Suspense>
				</div>
			</main>
		</div>
	)
}
