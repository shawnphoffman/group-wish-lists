import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'
import ProfileForm from '@/components/me/ProfileForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page() {
	const userPromise = getUser()

	const [{ data: user, error }] = await Promise.all([userPromise])

	// console.log('MyStuffClient', { user })

	if (error) {
		return notFound()
	}

	return (
		<div className="grid gap-6 animate-in">
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileForm name={user.display_name} id={user.user_id} birthMonth={user.birth_month} birthDay={user.birth_day} />
				</CardContent>
				<CardFooter className="px-6 py-4 border-t">
					<Button type="submit" form="update-profile-form">
						Save
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
