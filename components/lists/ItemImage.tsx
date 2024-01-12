type Props = {
	url?: string
}

export default function ItemImage({ url }: Props) {
	if (!url) return null
	return <img src={url} alt="" className="object-scale-down w-24 rounded-lg" />
}
