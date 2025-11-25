import { getMyPurchases } from '@/app/actions/lists'
import { getUserById, getUsers } from '@/app/actions/users'
import MyPurchasesClient from './MyPurchasesClient'
import { User } from '@/components/types'

type PurchaseItem = Awaited<ReturnType<typeof getMyPurchases>>[number]

export default async function MyPurchases() {
	const listsPromise = getMyPurchases()
	const usersPromise = getUsers()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [items, users] = await Promise.all([
		listsPromise,
		usersPromise,
		// fakePromise
	])

	const hydratedItems = items.map(item => ({
		...item,
		recipient: users.data?.find(u => u.user_id === item.recipient_user_id),
	}))

	return <MyPurchasesClient items={hydratedItems || []} />
}
