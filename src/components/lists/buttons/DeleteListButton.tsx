// NOTE Server side redirect/refresh example
import { redirect } from 'next/navigation'

import { deleteList } from '@/app/actions/lists'
import { DeleteIcon } from '@/components/icons/Icons'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { MenubarShortcut } from '@/components/ui/menubar'

async function handleDelete(formData: FormData) {
	'use server'
	const listId = formData.get('list-id') as string
	const resp = await deleteList(Number(listId))
	if (resp?.status === 'success') {
		redirect('/me')
	}
}

export default function DeleteListButton({ listId }: any) {
	return (
		<AlertDialog>
			<AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
				Delete List
				<MenubarShortcut>
					<DeleteIcon />
				</MenubarShortcut>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<form action={handleDelete}>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the list. If you just want to hide the list, try archiving it
							instead.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<input type="hidden" name="list-id" value={listId} />
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction type="submit">Continue</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	)
}
