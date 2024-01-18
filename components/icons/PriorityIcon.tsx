import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import { ItemPriority } from '@/utils/enums'

type Props = { priority: string; className?: string }

export default function ItemPriorityIcon({ priority, className }: Props) {
	if (priority === ItemPriority.Normal) return null

	let iconClass = ''
	let title = ''

	switch (priority) {
		case ItemPriority['Very High']:
			title = 'Very High'
			iconClass = 'fa-sharp fa-solid fa-fw fa-bolt fa-beat-fade text-yellow-400'
			break
		case ItemPriority.High:
			title = 'High'
			iconClass = 'fa-sharp fa-solid fa-up fa-fw text-orange-400'
			break
		case ItemPriority.Low:
			title = 'Low'
			iconClass = 'fa-sharp fa-solid fa-down fa-fw text-blue-400'
			break
	}

	return (
		<span title={`${title} Priority`}>
			<FontAwesomeIcon className={`${iconClass} text-lg ${className}`} />
		</span>
	)
}
