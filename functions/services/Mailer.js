const smtp = require('smtp-client');


class Mailer {
    constructor ({subject,recipient}, content) {

        let s = new smtp({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true
        });

        (async function() {
            await s.connect();
            await s.greet({hostname: 'smtp.gmail.com'}); // runs EHLO command or HELO as a fallback
            await s.authPlain({username: 'watchtowrthreats@gmail.com', password: 'w4tcht0wr'}); // authenticates a user
            await s.mail({from: 'watchtowrthreats@gmail.com'}); // runs MAIL FROM command
            await s.rcpt({to: recipient}); // runs RCPT TO command (run this multiple times to add more recii)
            await s.data(content); // runs DATA command and streams email source
            await s.quit(); // runs QUIT command
        })().catch(console.error);
        
    }
}

module.exports = Mailer;
