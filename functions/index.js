const queryIntent = require("./intents/queryIntent");
const onOffIntent = require('./intents/onOffIntent');
const setIntent = require('./intents/setIntent');

const configuration = require('./configuration');

const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const admin = require('firebase-admin');
admin.initializeApp();

const dbRoot = admin.database().ref('/');

app = dialogflow();

app.intent('query-intent', async (conv, {param}) => {
    return queryIntent.processQueryIntent(dbRoot, conv, param);
});

app.intent('set-intent', async (conv, {thing, value}) => {
    configuration.Configuration.setUserId("user-id-1234");
    configuration.Configuration.setUserDbRoot(dbRoot);
    await setIntent.processSetIntent(conv, thing, value);

});

app.intent('on-off-intent', async (conv, {thing, smarthome_toggle}) => {
    configuration.Configuration.setUserId("user-id-1234");
    configuration.Configuration.setUserDbRoot(dbRoot);
    await onOffIntent.processOnOffIntent(conv, thing, smarthome_toggle);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
