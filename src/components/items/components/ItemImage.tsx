type Props = {
	url?: string
	className?: string
}

export default function ItemImage({ url, className = '' }: Props) {
	if (!url) return null
	// eslint-disable-next-line @next/next/no-img-element
	return <img src={url} alt="" className={`object-scale-down rounded-lg border bg-white ${className}`} />
}
