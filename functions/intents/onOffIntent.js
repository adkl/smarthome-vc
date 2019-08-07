const responses = require('../responses');
const configuration = require('../configuration');

async function processOnOffIntent(conv, thing, smarthome_toggle) {
    switch (thing.toLowerCase()) {
        case "air conditioning":
            await processClimateToggle(conv, smarthome_toggle);
            break;
        case "windows":
            await processWindowsToggle(conv, smarthome_toggle);
            break;
    }
}

function parseClimateToggleInput(climateToggle) {
    const climateOnPhrases = ['turn on', 'switch on'];
    const climateOffPhrases = ['turn off', 'switch off', 'shut down'];

    if (climateOnPhrases.indexOf(climateToggle.toLowerCase()) !== -1) {
        return true;
    }
    else if (climateOffPhrases.indexOf(climateToggle.toLowerCase()) !== -1) {
        return false;
    }
    return undefined;
}

function resolveClimateStatus(climateStatus) {
    return (climateStatus === true) ? "on": "turned off"
}

async function processClimateToggle(conv, climate_toggle) {
    const dbRoot = configuration.Configuration.getUserDbRoot();
    const snapshot = await dbRoot.child('air-condition-status').once('value');
    const currentClimateStatus = snapshot.val();
    const requestedClimateStatus = parseClimateToggleInput(climate_toggle);

    if (requestedClimateStatus === undefined) {
        conv.ask(`I can't understand this. Please try to be more precise.`);
    }
    if (currentClimateStatus === requestedClimateStatus) {
        conv.ask(`The air conditioner is already ${resolveClimateStatus(currentClimateStatus)}.`)
    }
    else {
        const taskRef = await dbRoot.child('tasks').push({
            taskSpec: 'onOff',
            payload: {
                toggle: requestedClimateStatus,
                whatToToggle: "climate"
            }
        });
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                conv.ask(responses.genericErrorResponse());
                resolve();
            }, 3000);

            dbRoot.child(`completed-tasks/${taskRef.key}`).on(
                'value',
                function (snapshot) {
                    if (snapshot.exists() && snapshot.val().success) {
                        dbRoot.child('air-condition-status').set(requestedClimateStatus);
                        conv.ask(`Okay, the air conditioner is ${resolveClimateStatus(requestedClimateStatus)} now.`);
                        resolve()
                    }
                    else if (snapshot.exists() && !snapshot.val().success) {
                        conv.ask(responses.genericErrorResponse());
                        resolve()
                    }
                }
            )
        });
    }
}

function parseWindowsToggleInput(windows_toggle) {
    if (windows_toggle === "open") {
        return true;
    }
    else if (windows_toggle === "close") {
        return false;
    }
    return undefined;
}

function resolveWindowsStatus(requestedWindowsStatus) {
    return requestedWindowsStatus ? "open" : "closed"
}

async function processWindowsToggle(conv, windows_toggle) {
    const dbRoot = configuration.Configuration.getUserDbRoot();
    const snapshot = await dbRoot.child('windows').once('value');
    const currentWindowsStatus = snapshot.val();
    const requestedWindowsStatus = parseWindowsToggleInput(windows_toggle);

    if (requestedWindowsStatus === undefined) {
        conv.ask(`I can't understand this. Please try to be more precise.`);
    }
    if (currentWindowsStatus === windows_toggle) {
        conv.ask(`Windows are already ${resolveWindowsStatus(currentWindowsStatus)}.`);
    }
    else {
        const taskRef = await dbRoot.child("tasks").push({
            taskSpec: 'onOff',
            payload: {
                toggle: requestedWindowsStatus,
                whatToToggle: "windows"
            }
        });
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                conv.ask(responses.genericErrorResponse());
                resolve();
            }, 3000);

            dbRoot.child(`completed-tasks/${taskRef.key}`).on(
                'value',
                function (snapshot) {
                    if (snapshot.exists() && snapshot.val().success) {
                        dbRoot.child('windows').set(requestedWindowsStatus);
                        conv.ask(`Okay, windows are ${resolveWindowsStatus(requestedWindowsStatus)} now.`);
                        resolve()
                    }
                    else if (snapshot.exists() && !snapshot.val().success) {
                        conv.ask(responses.genericErrorResponse());
                        resolve()
                    }
                }
            )
        });
    }
}

exports.processOnOffIntent = processOnOffIntent;