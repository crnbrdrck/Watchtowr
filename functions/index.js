const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const mailer = require('./services/Mailer');
//const template=require('../services/templates/template');


exports.ServerUpdate = functions.database.ref('/servers/{instance}')
    .onWrite(event => {
        const apps = event.data.val();
        firebase.database().ref('/servers/{instance}/applications/{id}').once('value').then(function (snapshot) {
            applications = snapshot.val(); //I ccould combine these into a single call But i won't
        });
        firebase.database().ref('/servers/{instance}/os_version').once('value').then(function (snapshot) {
            UbuntuVers = snapshot.val();
        });
        firebase.database().ref('/servers/{instance}').once('value').then(function (snapshot) {
            serverID = snapshot.val();
        });
        issueMatch(applications, UbuntuVers, serverID);
    });

function issueMatch(applications, UbuntuVers, server_id) {
    //compare server stats to threats list, post issue to user if match found
    // Go through each application, see what it is and check threats for it
    applications.forEach(function(app) {
        console.log(app);
    }
}

function LogIssue(Issue, instance) {
    var user_id;
    var recipientEmail;
    firebase.database().ref('/servers/' + instance+'/user_id').once('value').then(function (snapshot) {
        user_id = snapshot.val();
    });

    firebase.database().ref('/users/' + user_id + '/email').once('value').then(function (snapshot) {
        RecipientEmail = snapshot.val(); //find user from server instance
    });

    const Mail = new mailer({ subject:"Watchtowr Alert", recipient:RecipientEmail },
                           'We found anerror on your server. Go to https://htn-threatmonitor.firebaseapp.com for more details');
    Mail.send();
    admin.database().ref('/issues').push({
        fixed: false,
        issue: Issue,
        server_id: instance
    });
}
