import { getSessionUser } from '@/app/actions/auth'
import { getListEditors } from '@/app/actions/lists'
import { getUsers } from '@/app/actions/users'
import { ShareIcon } from '@/components/icons/Icons'
import { List } from '@/components/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MenubarShortcut } from '@/components/ui/menubar'

import EditorCheckbox from './EditorCheckbox'

type Props = {
	listId: List['id']
}

export default async function EditorsButton({ listId }: Props) {
	const allUsersPromise = getUsers()
	const editorsPromise = getListEditors(listId)
	const mePromise = getSessionUser()
	const [allUsers, editors, me] = await Promise.all([allUsersPromise, editorsPromise, mePromise])

	const reducedUsers = allUsers.data
		?.sort((a, b) => {
			if (a.display_name < b.display_name) return -1
			if (a.display_name > b.display_name) return 1
			return 0
		})
		.reduce((memo: Record<string, string>, user) => {
			if (me?.id === user.user_id) return memo
			memo[user.display_name] = user.user_id
			return memo
		}, {})

	return (
		<Dialog>
			<DialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
				List Editors
				<MenubarShortcut>
					<ShareIcon />
				</MenubarShortcut>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>List Editors</DialogTitle>
					<DialogDescription>Who can help edit the items on this list?</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-1">
					{reducedUsers &&
						Object.keys(reducedUsers).map(name => (
							<div key={reducedUsers[name]} className="flex flex-row items-center gap-2">
								<EditorCheckbox id={reducedUsers[name]} isChecked={editors.includes(reducedUsers[name])} listId={listId} />
								<div>{name}</div>
							</div>
						))}
				</div>
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
