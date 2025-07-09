'use client'

import { useCallback, useState } from 'react'

import { updateUserPermissions } from '@/app/actions/users'
import { LoadingIcon } from '@/components/icons/Icons'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
	id: number | undefined
	viewer_id: string
	isChecked: boolean
}

export default function PermissionCheckbox({ id, viewer_id, isChecked }: Props) {
	const [checked, setChecked] = useState(isChecked)
	const [isPending, setIsPending] = useState(false)

	const handleChange = useCallback(
		(newChecked: boolean) => {
			// console.log('PermissionCheckbox:', newChecked)
			setIsPending(true)
			setChecked(newChecked)
			async function asyncUpdatePermission() {
				// await new Promise(resolve => setTimeout(resolve, 2000))
				await updateUserPermissions(id, viewer_id, newChecked)
				setIsPending(false)
				// router.refresh()
			}
			asyncUpdatePermission()
		},
		[id, viewer_id]
	)

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center">
			{isPending ? <LoadingIcon size="xl" /> : <Checkbox checked={checked} disabled={isPending} onCheckedChange={handleChange} />}
		</fieldset>
	)
}
