const sendgrid = require('../../sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');


class Mailer extends helper.Mail {
    constructor ({subject,recipient}, content) {
        super();
        
        this.sgApi = sendgrid(keys.sendGridKey);
        this.from_email = new helper.Email('no-reply@watchtowr.com');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipient = new helper.Email(recipient);
        
        this.addContent(this.body);
        const personalize = new helper.Personalization();
        personalize.addTo(recipient);
        this.addPersonalization(personalize);
        this.addClickTracking();
        
    }
    
    addClickTracking() {
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true,true);
        
        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }
    
    async send() {
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: this.toJSON()
        });
        
        const response = this.sgApi.API(request);
        return response;
    }
}

module.exports = Mailer;
