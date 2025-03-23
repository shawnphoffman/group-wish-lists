import Markdown from 'react-markdown'

export default function MarkdownBlock({ children }: { children: string }) {
	return (
		<div className="markdown">
			<Markdown
				allowedElements={['ul', 'ol', 'strong', 'em', 'li', 'a', 'p', 'h1', 'h2', 'h3']}
				unwrapDisallowed
				components={{
					h1: props => <h1 className="p-0 text-2xl font-bold">{props.children}</h1>,
					h2: props => <h2 className="text-xl font-bold">{props.children}</h2>,
					h3: props => <h3 className="text-lg font-bold">{props.children}</h3>,
				}}
			>
				{children}
			</Markdown>
		</div>
	)
}
