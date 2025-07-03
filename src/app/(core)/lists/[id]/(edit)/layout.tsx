import { Suspense } from 'react'

type LayoutProps = {
	children: React.ReactNode
}
export default async function EditLayout({ children }: LayoutProps) {
	return (
		<div className="flex flex-col flex-1 w-full max-w-5xl gap-6 sm:px-2 max-md:gap-2">
			<Suspense>{children}</Suspense>
		</div>
	)
}
