import './EmptyMessage.css'

import { faFaceThinking } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
	message?: string
}

export default function EmptyMessage({ message = 'Nothing to see here... yet' }: Props) {
	return (
		<div className="empty-container">
			<FontAwesomeIcon icon={faFaceThinking} className="text-2xl" />
			<div>{message}</div>
		</div>
	)
}
