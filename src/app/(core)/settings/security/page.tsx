import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

export default async function Page() {
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Security</CardTitle>
					{/* <CardDescription>Used to identify your store in the marketplace.</CardDescription> */}
				</CardHeader>
				{/* <CardContent>
					<form>
						<Input placeholder="Store Name" />
					</form>
				</CardContent>
				<CardFooter className="px-6 py-4 border-t">
					<Button>Save</Button>
				</CardFooter> */}
			</Card>
		</div>
	)
}
