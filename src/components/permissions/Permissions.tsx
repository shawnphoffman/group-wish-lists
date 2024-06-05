import PermissionCheckbox from './PermissionCheckbox'

import { getSessionUser } from '@/app/actions/auth'
import { getListEditors } from '@/app/actions/lists'
import { getUsers } from '@/app/actions/test'
import { List } from '@/components/types'

type Props = {
	listId: List['id']
}

export default async function Permissions({ listId }: Props) {
	const allUsersPromise = getUsers()
	const editorsPromise = getListEditors(listId)
	const mePromise = getSessionUser()
	const [allUsers, editors, me] = await Promise.all([allUsersPromise, editorsPromise, mePromise])

	const reducedUsers = allUsers.data?.reduce((memo: Record<string, string>, user) => {
		if (me?.id === user.user_id) return memo
		memo[user.display_name] = user.user_id
		return memo
	}, {})

	const canChange = true
	const isPending = false

	const handleChange = (e: any) => {
		console.log('change', e)
	}

	return (
		<div className="border-container" id="import-items">
			<h4>Permissions</h4>
			<div className="flex flex-col gap-1.5 items-stretch p-2">
				<p>Who can help edit the items on this list?</p>
				{reducedUsers &&
					Object.keys(reducedUsers).map(name => (
						<div key={reducedUsers[name]} className="flex flex-row items-center gap-2">
							{/* <input
								type="checkbox"
								checked={editors.includes(reducedUsers[name])}
								onChange={handleChange}
								readOnly={!canChange}
								className={`${isPending && '!bg-yellow-500'}`}
							/> */}
							<PermissionCheckbox id={reducedUsers[name]} isComplete={editors.includes(reducedUsers[name])} canChange={canChange} />
							<div>{name}</div>
						</div>
					))}
			</div>
			{/* <div className="flex flex-col gap-1.5 items-stretch p-2">
				<pre>
					<code>{JSON.stringify(reducedUsers, null, 2)}</code>
				</pre>
				<pre>
					<code>{JSON.stringify(editors, null, 2)}</code>
				</pre>
			</div> */}
		</div>
	)
}
