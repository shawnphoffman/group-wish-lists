import { ItemPriority } from '@/utils/enums'

export default function ItemPriorityIcon({ priority }: { priority: string }) {
	if (priority === ItemPriority.Normal) return null

	let iconClass = ''

	switch (priority) {
		case ItemPriority.VeryHigh:
			iconClass = 'fa-sharp fa-solid fa-bolt fa-beat-fade text-yellow-400'
			break
		case ItemPriority.High:
			iconClass = 'fa-sharp fa-solid fa-up text-orange-400'
			break
		case ItemPriority.Low:
			iconClass = 'fa-sharp fa-solid fa-down text-blue-400'
			break
	}

	return <i className={`${iconClass} text-xl`} aria-hidden="true" />
}
