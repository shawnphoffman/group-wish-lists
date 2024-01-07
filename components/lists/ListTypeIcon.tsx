import { ListType } from '@/utils/enums'

export default function ListTypeIcon({ type }: { type: string }) {
	let iconClass = 'fa-sharp fa-solid fa-thought-bubble'

	if (type === ListType.Birthday) {
		iconClass = 'fa-sharp fa-solid fa-birthday-cake'
	} else if (type === ListType.Christmas) {
		iconClass = 'fa-sharp fa-solid fa-tree-christmas'
	} else if (type === ListType.Test) {
		iconClass = 'fa-sharp fa-solid fa-vial-virus'
	}

	return <i className={`${iconClass} text-xl`} />
}
