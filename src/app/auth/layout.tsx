import { Suspense } from 'react'

import Loading from '../(core)/loading'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex flex-col items-center px-2 mx-auto overflow-x-hidden overflow-y-scroll h-dvh scroll-py-14">
			<Suspense fallback={<Loading />}>{children}</Suspense>
		</main>
	)
}
