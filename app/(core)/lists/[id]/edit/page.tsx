export default async function List({ params }: { params: { id: string } }) {
	return (
		<div className="w-full animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<div className="flex-1 flex flex-col gap-6">
				<h1>Edit List</h1>
				<div>{params.id}</div>
			</div>
		</div>
	)
}
