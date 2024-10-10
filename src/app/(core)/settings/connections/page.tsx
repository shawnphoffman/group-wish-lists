import { faCheckCircle } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getSessionUser } from '@/app/actions/auth'
import LinkToAppleButton from '@/components/me/LinkToAppleButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function MeClient() {
	const sessionPromise = getSessionUser()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [sessionUser] = await Promise.all([
		sessionPromise,
		// fakePromise
	])

	const hasAppleLinked = sessionUser?.identities?.some(i => i.provider === 'apple') || false

	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Account Linking</CardTitle>
					<CardDescription>Use this to connect your account to different services</CardDescription>
				</CardHeader>
				<CardContent>
					{/* TODO - Email linking */}
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
