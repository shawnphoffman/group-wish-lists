import { Suspense } from 'react'

import AdminArchivePurchasedButton from '@/components/admin/AdminArchivePurchasedButton'
import InviteUser from '@/components/admin/InviteUser'
import UserImpersonation from '@/components/admin/UserImpersonation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Admin() {
	// await new Promise(resolve => setTimeout(resolve, 50000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 animate-page-in">
			<div className="flex flex-col flex-1 gap-4">
				<h1>Admin</h1>
				<div className="flex flex-col gap-2">
					<Suspense>
						<UserImpersonation />
					</Suspense>
				</div>
				<div className="flex flex-col gap-2">
					<Suspense>
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-4 p-6 pt-0">
								<AdminArchivePurchasedButton />
							</CardContent>
						</Card>
					</Suspense>
				</div>
				<div className="flex flex-col gap-2">
					<Suspense>
						<InviteUser />
					</Suspense>
				</div>
			</div>
		</div>
	)
}
