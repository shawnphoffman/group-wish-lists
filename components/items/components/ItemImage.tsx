type Props = {
	url?: string
	className?: string
}

export default function ItemImage({ url, className = '' }: Props) {
	if (!url) return null
	return <img src={url} alt="" className={`object-scale-down rounded-lg bg-white ${className}`} />
}
