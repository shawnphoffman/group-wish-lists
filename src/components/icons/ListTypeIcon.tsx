import {
	faBirthdayCake,
	faLightbulb,
	faThoughtBubble,
	faTreeChristmas,
	faVialVirus,
} from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ListCategory, ListCategoryType } from '@/utils/enums'

type Props = { type: ListCategoryType; className?: string; isPrivate?: boolean }

export default function ListTypeIcon({ type, className = 'text-xl', isPrivate = false }: Props) {
	let iconColor = 'text-yellow-300'
	let icon = faThoughtBubble

	// if (isPrivate) {
	// 	iconClass = 'fa-duotone fa-fw fa-lock-keyhole text-violet-300'
	// } else
	if (type === ListCategory.Birthday) {
		icon = faBirthdayCake
		iconColor = 'text-pink-300'
	} else if (type === ListCategory.Christmas) {
		icon = faTreeChristmas
		iconColor = 'text-green-300'
	} else if (type === ListCategory.Test) {
		icon = faVialVirus
		iconColor = 'text-blue-300'
	} else if (type === ListCategory.GiftIdeas) {
		icon = faLightbulb
		iconColor = 'text-teal-300'
	}

	return <FontAwesomeIcon icon={icon} className={`${iconColor} ${className}`} />
}
