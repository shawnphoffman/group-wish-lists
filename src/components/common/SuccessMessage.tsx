import { faCircleCheck } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {
	message?: string
}

export default function SuccessMessage({ message = 'Successfully updated.' }: Props) {
	return (
		<Alert className="border-primary !text-primary">
			<FontAwesomeIcon icon={faCircleCheck} className="text-xl !text-primary" />
			<AlertTitle>Success</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
