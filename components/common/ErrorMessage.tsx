import FontAwesomeIcon from '../icons/FontAwesomeIcon'

import './ErrorMessage.css'

type Props = {
	error?: string
	includeTitle?: boolean
	className?: string
}

export default function ErrorMessage({ error = 'Something went wrong...', includeTitle = true, className = '' }: Props) {
	return (
		<div className={`error ${className}`} role="alert">
			<FontAwesomeIcon className="text-2xl fa-sharp fa-solid fa-circle-exclamation" />
			{includeTitle && <span className="font-bold">Error</span>} {error}
		</div>
	)
}
