import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {
	message?: string
	title?: boolean
}

export default function PlainMessage({ message, title }: Props) {
	return (
		<Alert variant="secondary">
			{title && <AlertTitle>{title}</AlertTitle>}
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
