import { getColor } from './Avatar'

import './Badge.css'

type Props = {
	className?: string
	children: React.ReactNode
	colorLabel?: string
}

export default function Badge({ className = '', children, colorLabel }: Props) {
	const colorClass = colorLabel ? getColor(colorLabel) : ''
	return <span className={`badge inline-flex ${colorClass} ${className}`}>{children}</span>
}
