const responses = require('../responses');

async function processSetIntent(dbRoot, conv, thing, value) {
    let userId = "user-id-1234";
    const taskRef = await dbRoot.ref(`users/${userId}/tasks`).push({
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

        dbRoot.child(`users/${userId}/completed-tasks/${taskRef.key}`).on(
            'value',
            function (snapshot) {
                if (snapshot.exists() && snapshot.val().success) {
                    dbRoot.child(`users/${userId}/completed-tasks/${taskRef.key}`).off();
                    conv.ask(`${thing} successfully set to ${value}`);
                    resolve();
                }
                else {
                    conv.ask(responses.genericErrorResponse());
                    resolve()
                }
            }
        )
    });
}

exports.processSetIntent = processSetIntent;