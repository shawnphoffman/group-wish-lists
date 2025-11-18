import {
	Body,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Row,
	// Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3002}`

interface PostBirthdayEmailProps {
	name: string
	items: { title: string; image_url: string; gifters: string[] }[]
}

export default function PostBirthdayEmail({ name, items }: PostBirthdayEmailProps) {
	return (
		<Html>
			<Head />
			{/* <Preview>Happy Birthday, {name}!</Preview> */}
			<Tailwind>
				<Body className="px-2 mx-auto my-auto font-sans bg-black dark`">
					<Container className="mx-auto my-[40px] max-w-[650px] rounded border bg-white border-[#eaeaea] border-solid p-[20px]">
						<Section className="mt-[32px]">
							<Img src={`${baseUrl}/images/email-icon.png`} width="80" height="80" alt="Wish Lists" className="mx-auto my-0" />
						</Section>
						<Heading className="mx-0 my-[20px] p-0 font-bold text-[24px] text-black text-center">A look back...</Heading>
						<Text className="text-base text-center">Here&apos;s a quick reference of some of the items that you were gifted.</Text>
						<Hr />
						{items.map((item, index) => (
							<Section key={index}>
								<Row className="flex flex-row items-center justify-center w-full">
									<Column className="w-20 px-2">
										<Img src={item.image_url} width="80" height="80" alt={item.title} className="mx-auto my-0" />
									</Column>
									<Column className="gap-2">
										<Text className="my-0 text-base font-bold leading-tight">{item.title}</Text>
										<Text className="my-0 text-sm">From: {item.gifters.join(', ')}</Text>
									</Column>
								</Row>
								<Hr />
							</Section>
						))}

						<Text className="text-sm text-center text-black">
							These items have been archived for convenience and can be found in the{' '}
							<Link href={`${baseUrl}/settings/received`}>Received Gifts</Link> section.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

PostBirthdayEmail.PreviewProps = {
	name: 'Shawn',
	items: [
		{
			title:
				'DEWALT 20V MAX Sander, Cordless, 5-Inch, 2.Ah, 8,000-12,000 OPM, Variable Speed Dial, Storage Bag, Battery and Charger Included (DCW210D1) - Amazon.com',
			image_url:
				'http://images.ctfassets.net/09hbx69ra4p2/1j2HfLOl7JErBAhsqPeDIL/8995f9d1f1b232df2f35d827e928a58e/6717-medgreyhtr-adult-detail-5-transparent.png',
			gifters: ['John', 'Jane'],
		},
		{
			title: 'Item 2',
			image_url: 'https://cdn.shopify.com/s/files/1/0903/6349/4707/files/product-image_2056_p_profile_1.jpg?v=1757131715',
			gifters: ['John', 'Jane'],
		},
	],
} as PostBirthdayEmailProps
