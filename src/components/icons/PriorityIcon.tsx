import { faBolt, faDown, faUp } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ItemPriority } from '@/utils/enums'

type Props = { priority: string; className?: string }

export default function ItemPriorityIcon({ priority, className }: Props) {
	if (priority === ItemPriority.Normal) return null

	let icon: IconDefinition | null = null
	let iconColor = ''
	let title = ''

	switch (priority) {
		case ItemPriority['Very High']:
			title = 'Very High'
			iconColor = 'text-yellow-400'
			icon = faBolt
			break
		case ItemPriority.High:
			title = 'High'
			iconColor = 'text-orange-400'
			icon = faUp
			break
		case ItemPriority.Low:
			title = 'Low'
			iconColor = 'text-blue-400'
			icon = faDown
			break
	}

	return (
		<span title={`${title} Priority`}>
			<FontAwesomeIcon icon={icon!} className={`${iconColor} text-lg ${className}`} beatFade={priority === ItemPriority['Very High']} />
		</span>
	)
}
