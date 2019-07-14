const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');

app = dialogflow();

app.intent('query-intent', (conv, {param}) => {
    conv.close(`Response from my fullfillment: ${param}`);
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
