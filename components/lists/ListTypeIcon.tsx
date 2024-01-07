import { ListType } from '@/utils/enums'

export default function ListTypeIcon({ type }: { type: string }) {
	// let iconClass = 'fa-sharp fa-solid fa-thought-bubble'
	let iconClass = 'fa-duotone fa-thought-bubble text-yellow-300'

	if (type === ListType.Birthday) {
		// iconClass = 'fa-sharp fa-solid fa-birthday-cake'
		iconClass = 'fa-duotone fa-birthday-cake text-pink-300'
	} else if (type === ListType.Christmas) {
		// iconClass = 'fa-sharp fa-solid fa-tree-chrismas'
		iconClass = 'fa-duotone fa-tree-christmas text-green-300'
	} else if (type === ListType.Test) {
		// iconClass = 'fa-sharp fa-solid fa-vial-virus'
		iconClass = 'fa-duotone fa-vial-virus text-blue-300'
	}

	return <i className={`${iconClass} text-xl`} aria-hidden="true" />
}
