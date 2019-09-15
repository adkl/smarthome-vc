const queryIntent = require("./intents/queryIntent");
const onOffIntent = require('./intents/onOffIntent');
const setIntent = require('./intents/setIntent');

const configuration = require('./configuration');

const functions = require('firebase-functions');
const {dialogflow, SignIn} = require('actions-on-google');
const admin = require('firebase-admin');
admin.initializeApp();

const dbRoot = admin.database().ref('/');

app = dialogflow({
    clientId: "997646807349-05o8f5ogecltddoa5m79lj73upc1uup2.apps.googleusercontent.com"
});

app.intent('query-intent', async (conv, {param}) => {
    if (undefined === conv.user.email) {
        return conv.ask(new SignIn()); // Korisnik nije autentificiran
    }
    // Korisnik je autentificiran, biblioteka sama obavlja dekodiranje i
    // verifikaciju ID tokena, te je email dostupan kroz conv.user objekat
    configuration.Configuration.setUserId(conv.user.email);
    configuration.Configuration.setUserDbRoot(dbRoot);
    return queryIntent.processQueryIntent(conv, param);
});

app.intent('set-intent', async (conv, {thing, value}) => {
    if (undefined === conv.user.email) {
        return conv.ask(new SignIn());
    }

    configuration.Configuration.setUserId(conv.user.email);
    configuration.Configuration.setUserDbRoot(dbRoot);
    await setIntent.processSetIntent(conv, thing, value);
});

app.intent('on-off-intent', async (conv, {thing, smarthome_toggle}) => {
    if (undefined === conv.user.email) {
        return conv.ask(new SignIn());
    }

    configuration.Configuration.setUserId(conv.user.email);
    configuration.Configuration.setUserDbRoot(dbRoot);
    await onOffIntent.processOnOffIntent(conv, thing, smarthome_toggle);
});

app.intent('handle-sign-in', (conv, params, signin) => {
    if (signin.status !== 'OK') {
        return conv.ask('I am sorry, but you need to sign in before using the app.');
    }
    return conv.ask('Great! Thanks for signing in. Now I can setup your account. What can I do for you next?');
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
