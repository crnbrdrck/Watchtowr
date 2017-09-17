const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const mailer = require('./services/Mailer');
//const template=require('../services/templates/template');


exports.ServerUpdate = functions.database.ref('/servers/{instance}')
    .onWrite(event => {
        const apps = event.data.val();
        firebase.database().ref('/servers/{ instance}/applications/apache').once('value').then(function (snapshot) {
            ApacheVers = snapshot.val(); //I ccould combine these into a single call But i won't
        });
        firebase.database().ref('/servers/{ instance}/applications/MYSQL').once('value').then(function (snapshot) {
            SQLVers = snapshot.val();
        });
        firebase.database().ref('/servers/{ instance}/os_version').once('value').then(function (snapshot) {
            UbuntuVers = snapshot.val();
        });
        firebase.database().ref('/servers/{instance}').once('value').then(function (snapshot) {
            serverID = snapshot.val();
        });
        issueMatch(ApacheVers, SQLVers, UbuntuVers, locX, locY, serverID);
    });

function issueMatch(ApacheVers, SQLVers, UbuntuVers, locX, locY, server_id) {
    //compare server stats to threats list, post issue to user if match found
    var versionAffected;
    firebase.database().ref('/threats/').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            versionAffected = snapshot.val();
            console.log(versionAffected);
            if (versionAffected.includes(ApacheVers || SQLVers || UbuntuVers)) { LogIssue(versionAffected, server_id); }
        });
    });
    
        firebase.database().ref('/threats/{id}/city').once('value').then(function (snapshot) {
            location = snapshot.val();
        if (Loc == location) { LogIssue(("Malware in your area" + location), server_id); }   
        });
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

    //const Mail = new mailer({ subject:"Watchtowr Alert", recipient:RecipientEmail }, template);
    //Mail.send();
    admin.database().ref('/issues').push({
        fixed: false,
        issue: Issue,
        server_id: instance,
    });
}
