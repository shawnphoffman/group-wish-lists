import './Badge.css'

type Props = {
	className?: string
	children: React.ReactNode
}

export default function Badge({ className, children }: Props) {
	return <span className={`badge ${className}`}>{children}</span>
}
