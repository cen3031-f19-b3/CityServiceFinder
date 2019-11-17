import mailgun from 'mailgun-js';
import config from '../config/config';

export const SendReportMessage = async (body: string) => {
    const mg = mailgun({
        apiKey: process.env.MAILGUN_API_KEY || config.mail.key,
        domain: process.env.MAILGUN_DOMAIN || config.mail.domain,
        publicApiKey: process.env.MAILGUN_PUBLIC_KEY || config.mail.public_key,
    });

    return mg.messages().send({
        from: process.env.EMAIL_FROM || config.mail.from,
        subject: 'City Service App Report',
        text: body,
        to: process.env.EMAIL_TO.split(',') || config.mail.to,
    });
};
