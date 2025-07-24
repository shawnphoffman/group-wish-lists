import { Suspense } from 'react'
import { faCog } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AdminSettingsLink from '@/components/admin/AdminSettingsLink'
import { FallbackRowThick } from '@/components/common/Fallbacks'

import SettingsLinks from './links'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col w-full max-w-5xl animate-page-in">
			<main className="flex flex-col flex-1 gap-6 px-2">
				<div className="relative grid w-full max-w-6xl gap-2 mx-auto">
					<h1>Settings</h1>
					<FontAwesomeIcon icon={faCog} className="text-[80px] opacity-40 absolute left-4 -top-5 -z-10 text-green-500" />
				</div>
				<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
					<nav className="grid gap-4 text-sm text-muted-foreground">
						<SettingsLinks />
						<AdminSettingsLink />
					</nav>
					<Suspense fallback={<FallbackRowThick />}>{children}</Suspense>
				</div>
			</main>
		</div>
	)
}
