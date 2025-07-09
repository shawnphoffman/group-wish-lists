'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { impersonateUser, stopImpersonation } from '@/app/actions/auth'
import { getSessionUser } from '@/app/actions/auth'
import { getUsersForImpersonation } from '@/app/actions/users'
import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UserImpersonation() {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [result, setResult] = useState<{ status?: string; error?: string; link?: string; user?: any }>({})
	const [adminUserId, setAdminUserId] = useState<string | null>(null)
	const [users, setUsers] = useState<Array<{ id: string; email: string }>>([])
	const [selectedEmail, setSelectedEmail] = useState<string>('')
	const router = useRouter()

	// Fetch users on component mount
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const users = await getUsersForImpersonation()
				// console.log('users', users)
				setUsers(users || [])
			} catch (error) {
				console.error('Failed to fetch users:', error)
			}
		}

		fetchUsers()
	}, [])

	const handleImpersonate = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setResult({})

		try {
			if (!selectedEmail) {
				setResult({ status: 'error', error: 'Please select a user or enter an email' })
				return
			}

			const result = await impersonateUser(selectedEmail)
			setResult(result)

			if (result.status === 'success' && result.link) {
				// Store the current admin user ID for returning later
				const currentUser = await getSessionUser()

				console.log('result', result, currentUser)
				if (currentUser) {
					setAdminUserId(currentUser.id)
				}

				// Redirect to the impersonation link
				window.location.href = result.link
			}
		} catch (error) {
			setResult({ status: 'error', error: 'An unexpected error occurred' })
		} finally {
			setIsLoading(false)
		}
	}

	const handleStopImpersonation = async () => {
		if (!adminUserId) {
			setResult({ status: 'error', error: 'No admin user ID found' })
			return
		}

		setIsLoading(true)
		setResult({})

		try {
			const result = await stopImpersonation(adminUserId)
			setResult(result)

			if (result.status === 'success' && result.link) {
				// Redirect back to admin user
				window.location.href = result.link
			}
		} catch (error) {
			setResult({ status: 'error', error: 'An unexpected error occurred' })
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>User Impersonation</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<form onSubmit={handleImpersonate} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="user-select">Select User</Label>
						<Select value={selectedEmail} onValueChange={setSelectedEmail}>
							<SelectTrigger>
								<SelectValue placeholder="Choose a user to impersonate" />
							</SelectTrigger>
							<SelectContent>
								{users.map(user => (
									<SelectItem key={user.email} value={user.email}>
										{user.email}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Or Enter Email Manually</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Enter user email to impersonate"
						/>
					</div>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Impersonating...' : 'Impersonate User'}
					</Button>
				</form>

				{result.error && <ErrorMessage error={result.error} />}
				{result.status === 'success' && <SuccessMessage />}

				{adminUserId && (
					<div className="pt-4 border-t">
						<p className="mb-2 text-sm text-muted-foreground">Currently impersonating a user. Click below to return to admin account.</p>
						<Button onClick={handleStopImpersonation} disabled={isLoading} variant="outline">
							{isLoading ? 'Returning...' : 'Return to Admin'}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
