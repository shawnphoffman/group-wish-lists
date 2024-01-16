import './Badge.css'

function getColor(name: string) {
	const colorArray = ['green', 'teal', 'blue', 'red', 'purple', 'yellow']
	const num = name.charAt(0).charCodeAt(0) + name.charAt(1).charCodeAt(0)
	const colorIndex = Math.abs(num % colorArray.length)
	return colorArray[colorIndex]
}

type Props = {
	className?: string
	children: React.ReactNode
	colorLabel?: string
}

export default function Badge({ className = '', children, colorLabel }: Props) {
	const colorClass = colorLabel ? getColor(colorLabel) : ''
	return <span className={`badge flex ${colorClass} ${className}`}>{children}</span>
}
