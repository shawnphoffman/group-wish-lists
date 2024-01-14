import FontAwesomeIcon from './FontAwesomeIcon'

export const FallbackIcon = () => (
	<div className="text-3xl text-white">
		<FontAwesomeIcon className="fa-sharp fa-solid fa-compact-disc fa-spin" />
	</div>
)

export const FallbackRow = ({ label }: { label?: string }) => {
	return (
		<div className=" list fallback">
			<div className="list-item" />
			<div className="list-item">{label}</div>
			<div className="list-item" />
		</div>
	)
}

export default FallbackRow
