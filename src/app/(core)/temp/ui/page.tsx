import { Badge } from '@/components/ui/badge'

export default async function Temp() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg gap-4 p-4">
			<div className="w-full p-4 border rounded bg-background text-foreground">bg-background text-foreground</div>
			<div className="w-full p-4 border rounded bg-accent text-accent-foreground">bg-accent text-accent-foreground</div>
			<div className="w-full p-4 border rounded bg-primary text-primary-foreground">bg-primary text-primary-foreground</div>
			<div className="w-full p-4 border rounded bg-secondary text-secondary-foreground">bg-secondary text-secondary-foreground</div>
			<div className="w-full p-4 border rounded bg-muted text-muted-foreground">bg-muted text-muted-foreground</div>
			<div className="w-full p-4 border rounded bg-destructive text-destructive-foreground">bg-destructive text-destructive-foreground</div>
			<div className="flex flex-row gap-1">
				<Badge variant="default">default</Badge>
				<Badge variant="destructive">destructive</Badge>
				<Badge variant="outline">outline</Badge>
				<Badge variant="secondary">secondary</Badge>
			</div>
		</div>
	)
}
