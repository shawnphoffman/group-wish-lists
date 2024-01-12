import { ListCategory, ListCategoryType } from '@/utils/enums'

import FontAwesomeIcon from './FontAwesomeIcon'

export default function TypeIcon({ type }: { type: ListCategoryType }) {
	let iconClass = 'fa-duotone fa-thought-bubble text-yellow-300'

	if (type === ListCategory.Birthday) {
		iconClass = 'fa-duotone fa-birthday-cake text-pink-300'
	} else if (type === ListCategory.Christmas) {
		iconClass = 'fa-duotone fa-tree-christmas text-green-300'
	} else if (type === ListCategory.Test) {
		iconClass = 'fa-duotone fa-vial-virus text-blue-300'
	}

	return <FontAwesomeIcon className={`${iconClass} text-xl`} />
}
