export default function Faq() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg gap-6 p-4 opacity-0 animate-in">
			<h1>FAQ</h1>

			<div className="flex flex-col gap-2">
				<h2>What's coming soon?</h2>
				<ul className="px-4 list-disc">
					<li>Importing Apple Notes is coming soon</li>
					<li>I hope to get Amazon Wish List importing working as well</li>
					<li>Moving items between lists</li>
					<li>Viewing the things that you've purchased for others</li>
					<li>Viewing everything you've received. I need to work out "closing dates" for this</li>
					<li>More users</li>
					<li>Guest users</li>
					<li>Making lists on behalf of others (e.g. the littles)</li>
					<li>Other cool stuff</li>
				</ul>
			</div>
		</div>
	)
}
