import { Suspense } from 'react'

import AdminArchivePurchasedButton from '@/components/admin/AdminArchivePurchasedButton'
import InviteUser from '@/components/admin/InviteUser'

export default async function Admin() {
	// await new Promise(resolve => setTimeout(resolve, 50000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 animate-page-in">
			<div className="flex flex-col flex-1 gap-8">
				<h1>Admin</h1>
				<div className="flex flex-col gap-2">
					<h2>Invite User</h2>
					<Suspense>
						<InviteUser />
					</Suspense>
				</div>
				<div className="flex flex-col gap-2">
					<h2>Quick Actions</h2>
					<Suspense>
						<AdminArchivePurchasedButton />
					</Suspense>
				</div>
			</div>
		</div>
	)
}
