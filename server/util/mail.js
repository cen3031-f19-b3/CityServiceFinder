const mailgun = require('mailgun-js');
const config = require('../config/config');

/**
 * Sends an email to the users specified in the config file.
 * 
 * @param {string} body The body of the message to send.
 */
const SendReportMessage = async (body) => {
    const mg = mailgun({
        apiKey: config.mail.key,
        publicApiKey: config.mail.public_key,
        username: config.mail.username,
        domain: config.mail.domain,
    });
    console.log(mg);
    return mg.messages().send({
        from: config.mail.from,
        to: config.mail.to,
        subject: 'City Service App Report',
        text: body,
    });
}

module.exports = {
    SendReportMessage
}
