import { Suspense } from 'react'

import InviteUser from '@/components/admin/InviteUser'

export default async function AdminInvite() {
	// await new Promise(resolve => setTimeout(resolve, 50000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 animate-page-in">
			<div className="flex flex-col flex-1 gap-6">
				<h1>Admin - Invite</h1>
				<Suspense>
					<InviteUser />
				</Suspense>
			</div>
		</div>
	)
}
