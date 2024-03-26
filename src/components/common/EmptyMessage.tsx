import './EmptyMessage.css'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'

type Props = {
	message?: string
}

export default function EmptyMessage({ message = 'Nothing to see here... yet' }: Props) {
	return (
		<div className="empty-container">
			<FontAwesomeIcon className="text-2xl fa-sharp fa-solid fa-face-thinking" />
			<div>{message}</div>
		</div>
	)
}
