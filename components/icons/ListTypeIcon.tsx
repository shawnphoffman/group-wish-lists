import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import { ListCategory, ListCategoryType } from '@/utils/enums'

type Props = { type: ListCategoryType; className?: string }

export default function ListTypeIcon({ type, className = 'text-xl' }: Props) {
	let iconClass = 'fa-duotone fa-fw fa-thought-bubble text-yellow-300'

	if (type === ListCategory.Birthday) {
		iconClass = 'fa-duotone fa-fw fa-birthday-cake text-pink-300'
	} else if (type === ListCategory.Christmas) {
		iconClass = 'fa-duotone fa-fw fa-tree-christmas text-green-300'
	} else if (type === ListCategory.Test) {
		iconClass = 'fa-duotone fa-fw fa-vial-virus text-blue-300'
	}

	return <FontAwesomeIcon className={`${iconClass} ${className}`} />
}
