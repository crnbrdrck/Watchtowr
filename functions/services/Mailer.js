const smtp = require('smtp-client');


class Mailer {
    constructor ({subject,recipient}, content) {

        this.s = new smtp({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true
        });
    }

    async send() {
        var x = await this.s.connect();
        x = await this.s.greet({hostname: 'smtp.gmail.com'}); // runs EHLO command or HELO as a fallback
        x = await this.s.authPlain({username: 'watchtowrthreats@gmail.com', password: 'w4tcht0wr'}); // authenticates a user
        x = await this.s.mail({from: 'watchtowrthreats@gmail.com'}); // runs MAIL FROM command
        x = await this.s.rcpt({to: recipient}); // runs RCPT TO command (run this multiple times to add more recii)
        x = await this.s.data(content); // runs DATA command and streams email source
        x = await this.s.quit(); // runs QUIT command
    }
}

module.exports = Mailer;
