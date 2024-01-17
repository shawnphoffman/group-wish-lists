import './ErrorMessage.css'

type Props = {
	error?: string
	includeTitle?: boolean
	className?: string
}

export default function ErrorMessage({ error = 'Something went wrong...', includeTitle = true, className = '' }: Props) {
	return (
		<div className={`error p-4 ${className}`} role="alert">
			{includeTitle && <span className="font-bold">Error</span>} {error}
		</div>
	)
}
