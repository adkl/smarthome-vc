const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const admin = require('firebase-admin');
admin.initializeApp();

const firebaseRef = admin.database().ref('/');

app = dialogflow();

app.intent('query-intent', async (conv, {param}) => {
    const snapshot = await firebaseRef.child('temperature').once('value');
    const snapshotVal = snapshot.val()
    conv.close(`emperature is: ${snapshotVal}`);
});

app.intent('set-climate-intent', (conv, {temperature}) => {
    conv.close(` not implemented Air conditioning device successfully set to ${temperature.amount}`)
});

app.intent('set-intent', (conv, {thing, value}) => {
    const task_id = "2fd0";
    firebaseRef.child(`users/user-id-1234/tasks/${task_id}`).set({
        intent: "set-intent",
        payload: {
            thing: thing,
            value: value
        }
    });
    return new Promise(function(resolve, reject) {

        setTimeout(function() {
            conv.close('There is an error in contacting the smart home controller');
            resolve();
        }, 3000);

        firebaseRef.child(`users/user-id-1234/completed-tasks/${task_id}`).on(
            'value',
            function(snapshot) {
                if (snapshot.exists() && snapshot.val() === "yes") {
                    firebaseRef.child('users/user-id-1234/completed-tasks').off();
                    conv.close(`${thing} successfully set to ${value}`);
                    resolve()
                }
            }
        )
    });
});

app.intent('on-off-intent', (conv, {thing, smarthome_toggle}) => {
    conv.close(`${thing} successfully toggled to ${smarthome_toggle}`)
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
