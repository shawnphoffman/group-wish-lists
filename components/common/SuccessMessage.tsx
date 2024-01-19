import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import './SuccessMessage.css'

type Props = {
	message?: string
}

export default function SuccessMessage({ message = 'Successfully updated.' }: Props) {
	return (
		<div className="success">
			<FontAwesomeIcon className="text-2xl fa-sharp fa-solid fa-circle-check" />
			<div>{message}</div>
		</div>
	)
}
