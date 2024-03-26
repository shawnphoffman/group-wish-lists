import { Suspense } from 'react'

export default async function AdminInvite() {
	// await new Promise(resolve => setTimeout(resolve, 50000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
			<div className="flex flex-col flex-1 gap-6">
				<h1>Admin - Invite</h1>
				<Suspense></Suspense>
			</div>
		</div>
	)
}
