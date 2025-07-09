'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { impersonateUser } from '@/app/actions/admin'
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

			if (result.link) {
				router.push(result.link)
				router.refresh()
			} else if (result.error) {
				setResult({ status: 'error', error: result.error })
			}
		} catch (error) {
			console.error('Error impersonating user:', error)
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
			</CardContent>
		</Card>
	)
}
