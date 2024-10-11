import { faCheckCircle } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getSessionUser } from '@/app/actions/auth'
import EmailForm from '@/components/me/EmailForm'
import LinkToAppleButton from '@/components/me/LinkToAppleButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function MeClient() {
	const sessionPromise = getSessionUser()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [sessionUser] = await Promise.all([
		sessionPromise,
		// fakePromise
	])

	const hasAppleLinked = sessionUser?.identities?.some(i => i.provider === 'apple') || false

	return (
		<div className="grid gap-6 animate-in">
			<Card>
				<CardHeader>
					<CardTitle>Account Linking</CardTitle>
					<CardDescription>Use this to connect your account to different services</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<EmailForm email={sessionUser!.email} />

					<Separator />

					{!hasAppleLinked ? (
						<LinkToAppleButton />
					) : (
						<div className="flex items-center gap-1 text-primary">
							<FontAwesomeIcon icon={faCheckCircle} />
							<>Apple Account Already Linked</>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
