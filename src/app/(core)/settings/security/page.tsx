import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'
import PasswordForm from '@/components/me/PasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page() {
	const userPromise = getUser()

	const [{ data: user, error }] = await Promise.all([userPromise])

	if (error) {
		return notFound()
	}

	return (
		<div className="grid gap-6 animate-in">
			<Card>
				<CardHeader>
					<CardTitle>Security</CardTitle>
					<CardDescription>Use this to change your password</CardDescription>
				</CardHeader>
				<CardContent>
					<PasswordForm id={user.user_id} />
				</CardContent>
			</Card>
		</div>
	)
}
