export const FallbackRow = ({ label }: { label?: string }) => {
	return (
		<div className="fallback">
			<div className="list-item" />
			<div className="list-item">{label}</div>
			<div className="list-item" />
		</div>
	)
}

export default FallbackRow
