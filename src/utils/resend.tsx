import { Resend } from 'resend'

import NewCommentEmail from '@/emails/new-comment-email'

export const resendClient = new Resend(process.env.RESEND_API_KEY)

export const sendNewCommentEmail = async (
	username: string,
	recipient: string,
	commenter: string,
	comment: string,
	itemTitle: string,
	listId: number,
	itemId: number
) => {
	const emailResp = await resendClient.emails.send({
		from: 'HoffStuff <admin@hoffstuff.com>',
		to: recipient,
		bcc: ['shawn@sent.as'],
		subject: 'New Comment on Wish Lists',
		react: (
			<NewCommentEmail username={username} commenter={commenter} comment={comment} itemTitle={itemTitle} listId={listId} itemId={itemId} />
		),
	})
	console.log('createComment.emailSent', emailResp)
}
