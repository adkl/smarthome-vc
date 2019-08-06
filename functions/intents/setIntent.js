const responses = require('../responses');
const configuration = require('../configuration');

function resolveFirebaseRefForThing(thing) {
    if (thing === "climate") {
        return "air-condition-temperature";
    }
}

function postProcessSetIntent(thing, value) {
    const firebaseThingRef = resolveFirebaseRefForThing(thing);

    if (thing === "climate") {
        configuration.Configuration.getUserDbRoot().child(`${firebaseThingRef}`).set(value);
    }
}

async function processSetIntent(conv, thing, value) {
    let dbRoot = configuration.Configuration.getUserDbRoot();
    const taskRef = await dbRoot.child(`tasks`).push({
        taskSpec: "set",
        payload: {
            thing: thing,
            value: value
        }
    });

    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            conv.close(responses.genericErrorResponse());
            resolve();
        }, 3000);

        dbRoot.child(`completed-tasks/${taskRef.key}`).on(
            'value',
            function (snapshot) {
                if (snapshot.exists() && snapshot.val().success) {
                    dbRoot.child(`completed-tasks/${taskRef.key}`).off();
                    postProcessSetIntent(thing, value);
                    conv.ask(`${thing} successfully set to ${value}`);
                    resolve();
                }
                else if (snapshot.exists() && !snapshot.val().success) {
                    conv.ask(responses.genericErrorResponse());
                    resolve()
                }
            }
        )
    });
}

exports.processSetIntent = processSetIntent;