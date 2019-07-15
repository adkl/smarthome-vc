const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const admin = require('firebase-admin');
admin.initializeApp();

const firebaseRef = admin.database().ref('/');

app = dialogflow();

app.intent('query-intent', async (conv, {param}) => {
    const snapshot = await firebaseRef.child('temperature').once('value');
    const snapshotVal = snapshot.val()
    conv.close(`temperature is: ${snapshotVal}`);
});

app.intent('set-climate-intent', (conv, {temperature}) => {
    conv.close(`Air conditioning device successfully set to ${temperature.amount}`)
});

app.intent('set-intent', (conv, {thing, value}) => {
    conv.close(`${thing} successfully set to ${value}`)
});

app.intent('on-off-intent', (conv, {thing, smarthome_toggle}) => {
    conv.close(`${thing} successfully toggled to ${smarthome_toggle}`)
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
