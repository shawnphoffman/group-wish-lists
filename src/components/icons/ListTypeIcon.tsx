import {
	faBirthdayCake,
	faCheckDouble,
	faLightbulb,
	faThoughtBubble,
	faTreeChristmas,
	faVialVirus,
} from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ListCategory, ListCategoryType } from '@/utils/enums'

type Props = {
	type: ListCategoryType
	className?: string
}

export default function ListTypeIcon({ type, className = 'text-xl' }: Props) {
	let iconColor = 'text-yellow-600 dark:text-yellow-300'
	let icon = faThoughtBubble

	if (type === ListCategory.Birthday) {
		icon = faBirthdayCake
		iconColor = 'text-pink-600 dark:text-pink-300'
	} else if (type === ListCategory.Christmas) {
		icon = faTreeChristmas
		iconColor = 'text-green-600 dark:text-green-300'
	} else if (type === ListCategory.Test) {
		icon = faVialVirus
		iconColor = 'text-blue-600 dark:text-blue-300'
	} else if (type === ListCategory.GiftIdeas) {
		icon = faLightbulb
		iconColor = 'text-teal-600 dark:text-teal-300'
	} else if (type === ListCategory.Todos) {
		icon = faCheckDouble
		iconColor = 'text-orange-600 dark:text-orange-300'
	}

	return <FontAwesomeIcon icon={icon} className={`${iconColor} ${className}`} />
}
