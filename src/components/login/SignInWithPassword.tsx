'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignInWithPassword() {
	const { pending } = useFormStatus()
	return (
		<fieldset disabled={pending} className="flex flex-col justify-center w-full gap-3">
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="email">Email</Label>
				<Input type="email" id="email" name="email" placeholder="Email" required />
			</div>
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="password">Password</Label>
				<Input type="password" id="password" name="password" placeholder="••••••••" required />
			</div>
			<Button>{pending ? 'Signing in...' : 'Sign in'}</Button>
		</fieldset>
	)
}
