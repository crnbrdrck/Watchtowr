const functions = require('firebase-functions');

exports.serverUpdate=functions.database.ref('issues/servers/{instance}/applications')
.onUpdate(event => {
    const apps = event.data.val();
    console.log(apps);
    usr = event.data.ref();
    console.log(ref);//should contain the path
    return 0;
}
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
