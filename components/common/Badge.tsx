import './Badge.css'

function getColorFromId(id: number) {
	const colorArray = ['pink', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple']
	const colorIndex = Math.abs(id % colorArray.length)
	return colorArray[colorIndex]
}

type Props = {
	className?: string
	children: React.ReactNode
	colorId?: number
}

export default function Badge({ className = '', children, colorId }: Props) {
	const colorClass = colorId ? getColorFromId(colorId) : ''
	return <span className={`badge ${colorClass} ${className}`}>{children}</span>
}
