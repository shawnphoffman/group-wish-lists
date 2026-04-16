'use client'

import { useCallback, useState, useTransition } from 'react'

import { updateUserPermissions } from '@/app/actions/users'
import { LoadingIcon } from '@/components/icons/Icons'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

type Props = {
	id: number | undefined
	viewer_id: string
	isChecked: boolean
}

export default function PermissionCheckbox({ id, viewer_id, isChecked }: Props) {
	const [checked, setChecked] = useState(isChecked)
	const [isPending, startTransition] = useTransition()
	const { toast } = useToast()

	const handleChange = useCallback(
		(newChecked: boolean) => {
			if (isPending) return
			// Optimistic; the server action revalidates the layout so the RSC
			// payload in the action response is authoritative on the next render.
			setChecked(newChecked)

			startTransition(async () => {
				const result = await updateUserPermissions(id, viewer_id, newChecked)
				if (result.status === 'error') {
					setChecked(!newChecked)
					toast({
						title: 'Could not update permission',
						description: result.message,
						variant: 'destructive',
					})
				}
			})
		},
		[id, isPending, toast, viewer_id]
	)

	return (
		<fieldset disabled={isPending} className="flex items-center justify-center">
			{isPending ? <LoadingIcon size="xl" /> : <Checkbox checked={checked} disabled={isPending} onCheckedChange={handleChange} />}
		</fieldset>
	)
}
