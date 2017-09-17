const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const mailer = require('./services/Mailer');


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
    // 'FIX' all existing issues for this server
    admin.database().ref('issues').orderByChild('server_id').equalTo(server_id).on('value', function(snapshot){
        admin.database().ref('issues/' + snapshot.key).update({fixed: true});
    });
    admin.database().ref(applicationKey).orderByKey().on('child_added', function(snapshot) {
        app = {name: snapshot.key, val: snapshot.val()};
        console.log(app);
    });
    let threats = [];
    // Cross reference with threats where the name of the threat is contained in the app
    if (typeof app !== 'undefined'){
        admin.database().ref('threats').orderByKey().on('child_added', function(snapshot) {
            let threat = snapshot.key.toLowerCase();
            console.log('Checking for threats in', app.name, '.', threat)
            if (app.name.indexOf(threat) !== -1){
                // Check for correct version
                console.log('Possible Threat detected: ' + threat);
                // Search through all the threat versions to see if your app version is < the threat
                admin.database().ref('threats/' + snapshot.key).orderByKey().on('child_added', function(inner_snap) {
                    // Check the version against the app
                    if(vulnerable(app.val, inner_snap.val().version)){
                        LogIssue(app.name + ' is outdated. Try upgrading.', server_id);
                        return;
                    }
                });
            }
        });
    }
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

    const Mail = new mailer({ subject:"WatchTowr Alert", recipient:RecipientEmail },
                           'We found an error on your server. Go to https://htn-threatmonitor.firebaseapp.com for more details');
    Mail.send();
    admin.database().ref('/issues').push({
        fixed: false,
        issue: Issue,
        server_id: instance
    });
}

function vulnerable(appVer, threatVer){
    // Assume semver for now. Report whether appVer is vulnerable for the threat
    console.log('Checking vulns between', appVer, threatVer);
    appVer = appVer.split('.');
    while(appVer.length < 3) { appVer.push('0'); }
    threatVer = threatVer.split('.');
    while(threatVer.length < 3) { threatVer.push('0'); } 
    return appVer[0] < threatVer[0] || appVer[0] == threatVer[0] && appVer[1] < threatVer[1] || appVer[0] == threatVer[0] && appVer[1] == threatVer[1] && appVer[2] < threatVer[2];
}
