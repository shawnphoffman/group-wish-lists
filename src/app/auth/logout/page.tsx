import { signOut } from '@/app/actions/auth'

export default async function Logout() {
	await signOut()
}
