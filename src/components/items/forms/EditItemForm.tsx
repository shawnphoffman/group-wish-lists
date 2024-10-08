import { useFormState } from 'react-dom'

import { editItem } from '@/app/actions/items'
import ItemFormFields from '@/components/items/forms/ItemFormFields'
import { List, ListItem } from '@/components/types'

type Props = {
	listId: List['id']
	item?: ListItem
}

export default function EditItemForm({ listId, item }: Props) {
	const [state, formAction] = useFormState(editItem, {})

	return (
		<form action={formAction} className="flex flex-col items-stretch gap-2 px-2 pt-4 pb-2">
			<ItemFormFields listId={listId} formState={state} item={item} />
		</form>
	)
}
