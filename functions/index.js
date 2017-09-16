const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.ServerUpdate = functions.database.ref('/servers/{instance}')
    .onWrite(event => {
        const apps = event.data.val();
        LogIssue("test", "1234");
        console.log(apps);
        usr = event.data.ref();
        console.log(ref);//should contain the path
        return 3;
    });

function issueMatch(ApacheVers, SQLVers, UbuntuVers, Loc, server_id) {
    //compare server stats to threats list, post issue to user if match found
    firebase.database().ref('/threats/{id}/versionAffected').once('value').then(function (snapshot) {
        versionAffected = snapshot.val(); 
        if (versionAffected.includes(ApacheVers || SQLVers || UbuntuVers)) { LogIssue(versionAffected, server_id); }
    });
        firebase.database().ref('/threats/{id}/city').once('value').then(function (snapshot) {
            location = snapshot.val();
        if (Loc == location) { LogIssue(("Malware in your area" + location), server_id); }   
        });
}

function LogIssue(Issue, instance) {
    firebase.database.ref('/issues').push({
        fixed: false,
        issue: Issue,
        server_id: instance,
    });
}