import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'
import PasswordForm from '@/components/me/PasswordForm'
import ProfileForm from '@/components/me/ProfileForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page() {
	const userPromise = getUser()

	const [{ data: user, error }] = await Promise.all([userPromise])

	if (error) {
		return notFound()
	}

	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Security</CardTitle>
					<CardDescription>Use this to change your password</CardDescription>
				</CardHeader>
				<CardContent>
					<PasswordForm id={user.user_id} />
				</CardContent>
				{/* <CardFooter className="px-6 py-4 border-t">
					<Button>Save</Button>
				</CardFooter> */}
			</Card>
		</div>
	)
}
