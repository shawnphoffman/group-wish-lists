function getColor(name: string) {
	const colorArray = [
		'border-green-500 text-green-500',
		'border-teal-400 text-teal-400',
		'border-blue-400 text-blue-400 dark:text-blue-400 dark:text-blue-400',
		'border-red-400 text-red-400',
		'border-purple-400 text-purple-400',
		'border-yellow-500 text-yellow-500/30 dark:text-yellow-500',
	]
	const num = name.charAt(0).charCodeAt(0) + name.charAt(1).charCodeAt(0)
	const colorIndex = Math.abs(num % colorArray.length)

	return colorArray[colorIndex]
}

export default function Avatar({ name, className }: any) {
	return (
		<span
			className={`inline-flex items-center justify-center h-[2.875rem] w-[2.875rem] text-xl font-semibold leading-none rounded-full border ${getColor(
				name
			)} ${className}`}
			title={name}
		>
			{name[0].toUpperCase()}
		</span>
	)
}
