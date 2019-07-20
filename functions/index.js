const queryIntent = require("./intents/queryIntent");

const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const admin = require('firebase-admin');
admin.initializeApp();

const dbRoot = admin.database().ref('/');

app = dialogflow();

app.intent('query-intent', async (conv, {param}) => {
    return queryIntent.processQueryIntent(dbRoot, conv, param);
});

app.intent('set-climate-intent', (conv, {temperature}) => {
    conv.close(` not implemented Air conditioning device successfully set to ${temperature.amount}`)
});

app.intent('set-intent', (conv, {thing, value}) => {
    // return processSetIntent(conv, thing, value);
    const task_id = "2fd0";
    dbRoot.child(`users/user-id-1234/tasks/${task_id}`).set({
        intent: "set-intent",
        payload: {
            thing: thing,
            value: value
        }
    });
    return new Promise(function(resolve, reject) {

        setTimeout(function() {
            conv.close(genericErrorResponse());
            resolve();
        }, 3000);

        dbRoot.child(`users/user-id-1234/completed-tasks/${task_id}`).on(
            'value',
            function(snapshot) {
                if (snapshot.exists() && snapshot.val() === "yes") {
                    dbRoot.child('users/user-id-1234/completed-tasks').off();
                    conv.close(`${thing} successfully set to ${value}`);
                    resolve()
                }
            }
        )
    });
});

app.intent('on-off-intent', (conv, {thing, smarthome_toggle}) => {
    // return processOnOffIntent(conv, thing, smarthome_toggle);
    conv.close(`${thing} successfully toggled to ${smarthome_toggle}`)
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
