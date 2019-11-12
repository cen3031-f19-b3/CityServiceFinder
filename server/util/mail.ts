import mailgun from 'mailgun-js';
import config from '../config/config';

export const SendReportMessage = async (body: string) => {
    const mg = mailgun({
        apiKey: config.mail.key,
        domain: config.mail.domain,
        publicApiKey: config.mail.public_key,
    });

    return mg.messages().send({
        from: config.mail.from,
        subject: 'City Service App Report',
        text: body,
        to: config.mail.to,
    });
};
