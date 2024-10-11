import { getSessionUser } from '@/app/actions/auth'
import { getUsers } from '@/app/actions/test'
import { getUserPermissions } from '@/app/actions/users'
import UserPermissionCheckbox from '@/components/permissions/UserPermissionCheckbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type PermUser = {
	user_id: string
	display_name: string
	can_view: boolean
	perm_id: number | undefined
	owner_id: string
}

export default async function MeClient() {
	const allUsersPromise = getUsers()
	const sessionPromise = getSessionUser()
	const permsPromise = getUserPermissions()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [allUsers, me, perms] = await Promise.all([
		allUsersPromise,
		sessionPromise,
		permsPromise,
		// fakePromise
	])

	const reducedUsers = allUsers.data
		?.sort((a, b) => {
			if (a.display_name < b.display_name) return -1
			if (a.display_name > b.display_name) return 1
			return 0
		})
		?.reduce((memo: Record<string, PermUser>, user) => {
			if (me?.id === user.user_id) return memo

			const permResp = perms.data?.find(p => p.viewer_user_id === user.user_id)

			memo[user.display_name] = {
				user_id: user.user_id,
				display_name: user.display_name,
				can_view: !(permResp?.can_view === false),
				perm_id: permResp?.id,
				owner_id: permResp?.owner_user_id,
			}
			return memo
		}, {})

	// console.log('reducedUsers', reducedUsers)

	return (
		<div className="grid gap-6 animate-in">
			<Card>
				<CardHeader>
					<CardTitle>Viewing Permissions</CardTitle>
					<CardDescription>Select who can interact with your public lists</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-1">
						{reducedUsers &&
							Object.keys(reducedUsers).map(name => (
								<div key={reducedUsers[name].user_id} className="flex flex-row items-center gap-2">
									<UserPermissionCheckbox
										id={reducedUsers[name].perm_id}
										viewer_id={reducedUsers[name].user_id}
										isChecked={reducedUsers[name].can_view}
									/>
									<div>{name}</div>
								</div>
							))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
