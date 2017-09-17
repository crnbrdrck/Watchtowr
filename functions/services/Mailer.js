const smtp = require('smtp-client').SMTPClient;


class Mailer {
    constructor ({subject,recipient}, content) {

        this.s = new smtp({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true
        });
    }

    send() {
        this.s.connect();
        this.s.greet({hostname: 'smtp.gmail.com'}); // runs EHLO command or HELO as a fallback
        this.s.authPlain({username: 'watchtowrthreats@gmail.com', password: 'w4tcht0wr'}); // authenticates a user
        this.s.mail({from: 'watchtowrthreats@gmail.com'}); // runs MAIL FROM command
        this.s.rcpt({to: recipient}); // runs RCPT TO command (run this multiple times to add more recii)
        this.s.data(content); // runs DATA command and streams email source
        this.s.quit(); // runs QUIT command
    }
}

module.exports = Mailer;
