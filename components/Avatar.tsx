import './Avatar.css'

/*
	<Avatar name={'Shawn'} />
	<Avatar name={'Melissa'} />
	<Avatar name={'Jason'} />
	<Avatar name={'Graham'} />
	<Avatar name={'Chase'} />
	<Avatar name={'Sam'} />
	<Avatar name={'Carol'} />
	<Avatar name={'Jeff'} />
	<Avatar name={'Kate'} />
*/

export function getColor(name: string) {
	const colorArray = ['green', 'teal', 'blue', 'red', 'purple', 'yellow']
	const num = name.charAt(0).charCodeAt(0) + name.charAt(1).charCodeAt(0)
	const colorIndex = Math.abs(num % colorArray.length)
	return colorArray[colorIndex]
}

type Props = {
	name?: string
	className?: string
}

export default function Avatar({ name = '', className }: Props) {
	return (
		<span className={`avatar ${getColor(name)} ${className}`} title={name}>
			{name[0]}
		</span>
	)
}
