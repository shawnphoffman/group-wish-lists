import { faGift } from '@awesome.me/kit-ac8ad9255a/icons/sharp/regular'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Loading() {
	return (
		<div className="w-24 text-2xl text-center text-primary">
			<FontAwesomeIcon icon={faGift} size="lg" beatFade className="transition-colors text-destructive group-hover:animate-spin" />
		</div>
	)
}
