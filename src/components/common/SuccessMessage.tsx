import './SuccessMessage.css'

import { faCircleCheck } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
	message?: string
}

export default function SuccessMessage({ message = 'Successfully updated.' }: Props) {
	return (
		<div className="success">
			<FontAwesomeIcon icon={faCircleCheck} className="text-2xl" />
			<div>{message}</div>
		</div>
	)
}
