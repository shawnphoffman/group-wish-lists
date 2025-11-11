import { faCircleCheck } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {
	message?: string
	includeTitle?: boolean
}

export default function SuccessMessage({ message = 'Successfully updated.', includeTitle = true }: Props) {
	return (
		<Alert className="border-primary !text-primary">
			<FontAwesomeIcon icon={faCircleCheck} className="text-xl !text-primary" />
			{includeTitle && <AlertTitle>Success</AlertTitle>}
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
