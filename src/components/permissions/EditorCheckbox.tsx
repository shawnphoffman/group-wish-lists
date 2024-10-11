'use client'

import { useCallback, useState } from 'react'

import { createEditor, deleteEditor } from '@/app/actions/lists'
import { LoadingIcon } from '@/components/icons/Icons'
import { List, User } from '@/components/types'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
	id: User['user_id']
	listId: List['id']
	isChecked: boolean
}

export default function EditorCheckbox({ id, isChecked, listId }: Props) {
	const [checked, setChecked] = useState(isChecked)
	const [isPending, setIsPending] = useState(false)

	const handleChange = useCallback(
		(newChecked: boolean) => {
			// console.log('EditorCheckbox:', newChecked)
			setIsPending(true)

			async function asyncUpdateEditor() {
				if (newChecked) {
					await createEditor(listId, id)
				} else {
					await deleteEditor(listId, id)
				}
				setChecked(newChecked)
				setIsPending(false)
			}
			asyncUpdateEditor()
		},
		[id, listId]
	)

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center">
			{isPending ? <LoadingIcon size="xl" /> : <Checkbox checked={checked} disabled={isPending} onCheckedChange={handleChange} />}
		</fieldset>
	)
}
