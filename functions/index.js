const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const mailer = require('./services/Mailer');
//const template=require('../services/templates/template');


exports.ServerUpdate = functions.database.ref('servers/{instance}/applications/{app_id}')
    .onCreate(event => {
        let app_id = event.params.app_id;
        let server_id = event.params.instance;
        issueMatch(app_id, server_id);
    });

function issueMatch(app_id, server_id) {
    //compare server stats to threats list, post issue to user if match found
    // Go through each application, see what it is and check threats for it
    let serverKey = 'servers/' + server_id;
    let applicationKey = serverKey + '/applications/' + app_id;
    let app;
    admin.database.ref(applicationKey).orderByKey().on('child_added', function(snapshot) {
        app = snapshot.val()
    });
    let threats = [];
    // Cross reference with threats where the name of the threat is contained in the app
    admin.database.ref('threats').orderByKey().on('child_added', function(snapshot) {
        let threat = snapshot.key.lower();
        if (app.name.lower().index(threat) !== -1){
            // Check for correct version
            console.log('Possible Threat detected');
        }
    });
}

function LogIssue(Issue, instance) {
    var user_id;
    var recipientEmail;
    admin.database().ref('servers/' + instance+'/user_id').once('value').then(function (snapshot) {
        user_id = snapshot.val();
    });

    admin.database().ref('users/' + user_id + '/email').once('value').then(function (snapshot) {
        RecipientEmail = snapshot.val(); //find user from server instance
    });

    const Mail = new mailer({ subject:"Watchtowr Alert", recipient:RecipientEmail },
                           'We found an error on your server. Go to https://htn-threatmonitor.firebaseapp.com for more details');
    Mail.send();
    admin.database().ref('/issues').push({
        fixed: false,
        issue: Issue,
        server_id: instance
    });
}
