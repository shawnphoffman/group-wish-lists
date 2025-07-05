import { faBirthdayCake, faGift, faLightbulb, faTreeChristmas, faVialVirus } from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/light'
import { faCheckDouble } from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ListCategory, ListCategoryType } from '@/utils/enums'

type Props = {
	type: ListCategoryType
	className?: string
}

export default function ListTypeIcon({ type, className = 'text-xl' }: Props) {
	// let iconColor = 'text-yellow-600 dark:text-yellow-300'
	// let icon = faThoughtBubble
	let iconColor = 'text-red-500'
	let icon = faGift

	if (type === ListCategory.Birthday) {
		icon = faBirthdayCake
		iconColor = 'text-pink-500'
	} else if (type === ListCategory.Christmas) {
		icon = faTreeChristmas
		iconColor = 'text-green-500'
	} else if (type === ListCategory.Test) {
		icon = faVialVirus
		iconColor = 'text-blue-500'
	} else if (type === ListCategory.GiftIdeas) {
		icon = faLightbulb
		iconColor = 'text-teal-500'
	} else if (type === ListCategory.Todos) {
		// icon = faCheckDouble
		icon = faCheckDouble
		iconColor = 'text-orange-500'
	}

	return <FontAwesomeIcon icon={icon} className={`${iconColor} ${className}`} fixedWidth />
}
