export default function Code({ code }: { code: string }) {
	return (
		<pre className="relative p-4 my-0 overflow-scroll text-xs text-green-300 rounded-md bg-foreground/5">
			<code>{code}</code>
		</pre>
	)
}
