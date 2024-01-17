import './EmptyMessage.css'

type Props = {
	message?: string
}

export default function EmptyMessage({ message = 'Nothing to see here... yet' }: Props) {
	return <div className="empty-container">{message}</div>
}
