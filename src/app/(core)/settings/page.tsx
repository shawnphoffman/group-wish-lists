import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'
import ProfileForm from '@/components/me/ProfileForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

export default async function Page() {
	const userPromise = getUser()
	// const sessionPromise = getSessionUser()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: user, error }] = await Promise.all([
		// const [{ data: user, error }, sessionUser] = await Promise.all([
		userPromise,
		// sessionPromise,
		// fakePromise
	])
	console.log('MyStuffClient', { user })

	// if (!user || error) {
	if (error) {
		console.log('MyStuffClient.error', { user, error })
		return notFound()
	}
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
					{/* <CardDescription>Used to identify your store in the marketplace.</CardDescription> */}
				</CardHeader>
				<CardContent>
					<ProfileForm name={user.display_name} id={user.user_id} />
					{/* <Input placeholder="Store Name" /> */}
				</CardContent>
				<CardFooter className="px-6 py-4 border-t">
					<Button>Save</Button>
				</CardFooter>
			</Card>
			{/*  */}
			<Card>
				<CardHeader>
					<CardTitle>My Lists</CardTitle>
					{/* <CardDescription>The directory within your project, in which your plugins are located.</CardDescription> */}
				</CardHeader>
				<CardContent>
					{/* <form className="flex flex-col gap-4">
						<Input placeholder="Project Name" defaultValue="/content/plugins" />
						<div className="flex items-center space-x-2">
							<Checkbox id="include" defaultChecked />
							<label
								htmlFor="include"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Allow administrators to change the directory.
							</label>
						</div>
					</form> */}
				</CardContent>
				{/* <CardFooter className="px-6 py-4 border-t">
					<Button>Save</Button>
				</CardFooter> */}
			</Card>
		</div>
	)
}
