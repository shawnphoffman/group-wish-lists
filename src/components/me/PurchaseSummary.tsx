import { getMyPurchaseAddons, getMyPurchases } from '@/app/actions/gifts'
import { getUsers } from '@/app/actions/users'
import { getUser } from '@/app/actions/auth'
import PurchaseSummaryClient from './PurchaseSummaryClient'

export default async function PurchaseSummary() {
	const purchasesPromise = getMyPurchases()
	const addonsPromise = getMyPurchaseAddons()
	const usersPromise = getUsers()
	const currentUserPromise = getUser()

	const [purchases, addons, users, currentUser] = await Promise.all([purchasesPromise, addonsPromise, usersPromise, currentUserPromise])

	const hydratedItems =
		purchases?.map(item => ({
			...item,
			recipient: users.data?.find(u => u.user_id === item.recipient_user_id),
		})) || []

	addons?.forEach(addon => {
		hydratedItems.push({
			...addon,
			gift_created_at: addon.created_at,
			type: 'addon',
			recipient: users.data?.find(u => u.user_id === addon.recipient_user_id),
		})
	})

	const sortedItems = hydratedItems.sort((a, b) => {
		return new Date(b.gift_created_at).getTime() - new Date(a.gift_created_at).getTime()
	})

	return <PurchaseSummaryClient items={sortedItems || []} currentUserId={currentUser.data?.user_id || null} />
}
