import { Body, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components'

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3002'

interface ChristmasEmailProps {}

export default function ChristmasEmail() {
	return (
		<Html>
			<Head />
			<Preview>Merry Christmas!</Preview>
			<Tailwind>
				<Body className="px-2 mx-auto my-auto font-sans bg-black dark`">
					<Container className="mx-auto my-[40px] max-w-[465px] rounded border bg-white border-[#eaeaea] border-solid p-[20px]">
						<Section className="mt-[32px]">
							<Img src={`${baseUrl}/images/xmas-icon.png`} width="80" height="80" alt="Wish Lists" className="mx-auto my-0" />
						</Section>
						<Heading className="mx-0 my-[30px] p-0 text-center font-bold text-[24px] text-black">🎄 Happy Holidays! 🎄</Heading>
						<Text className="text-[14px] text-black leading-[24px] text-center">
							Merry Christmas! We hope you have a great holiday season! 🎅
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

ChristmasEmail.PreviewProps = {} as ChristmasEmailProps
