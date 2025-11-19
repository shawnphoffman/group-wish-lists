import { Resend } from 'resend'

import NewCommentEmail from '@/emails/new-comment-email'
import TestEmail from '@/emails/test-email'

export const resendClient = new Resend(process.env.RESEND_API_KEY)

export const getFromEmail = (): string => {
	const email = process.env.RESEND_FROM_EMAIL!
	const name = process.env.RESEND_FROM_NAME
	return name ? `${name} <${email}>` : email
}

export const getBccAddress = (): string[] | undefined => {
	const bcc = process.env.RESEND_BCC_ADDRESS
	return bcc ? [bcc] : undefined
}

export const commonEmailProps = () => {
	const from = getFromEmail()
	const bcc = getBccAddress()
	return {
		from,
		...(bcc ? { bcc } : {}),
	}
}

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
		...commonEmailProps(),
		to: recipient,
		subject: 'New Comment on Wish Lists',
		react: (
			<NewCommentEmail username={username} commenter={commenter} comment={comment} itemTitle={itemTitle} listId={listId} itemId={itemId} />
		),
	})
	console.log('createComment.emailSent', emailResp)
}

export const sendTestEmail = async () => {
	const emailResp = await resendClient.emails.send({
		from: getFromEmail(),
		to: process.env.RESEND_BCC_ADDRESS!,
		subject: 'Test Email',
		react: <TestEmail />,
	})
	console.log('sendTestEmail', emailResp)
	return emailResp
}
