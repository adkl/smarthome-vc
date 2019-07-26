async function processOnOffIntent(dbRoot, conv, thing, smarthome_toggle) {
    switch (thing.toLowerCase()) {
        case "air conditioning":
            await processClimateToggle(dbRoot, conv, smarthome_toggle);
            break;
        case "windows":
            await processWindowsToggle();
            break;
    }
    conv.ask(`${thing} successfully toggled to ${smarthome_toggle}`)
}

function parseClimateToggleInput(climateToggle) {
    const climateOnPhrases = ['turn on', 'switch on'];
    const climateOffPhrases = ['turn off', 'switch off', 'shut down'];

    if (climateOffPhrases.indexOf(climateToggle.toLowerCase()) !== -1) {
        return true;
    }
    else if (climateOnPhrases.indexOf(climateToggle.toLowerCase()) !== -1) {
        return false;
    }
    return undefined;
}

function resolveClimateStatus(climateStatus) {
    return (climateStatus === true) ? "on": "turned off"
}

async function processClimateToggle(dbRoot, conv, climate_toggle) {
    const snapshot = await dbRoot.child('users/user-id-1234/air-condition-status').once('value');
    const currentClimateStatus = snapshot.val();
    const requestedClimateStatus = parseClimateToggleInput(climate_toggle);

    if (requestedClimateStatus === undefined) {
        conv.ask(`I can't understand this. Please try to be more precise.`);
    }
    if (currentClimateStatus === requestedClimateStatus) {
        conv.ask(`The air conditioner is already ${resolveClimateStatus(currentClimateStatus)}.`)
    }
    else {
        dbRoot.child('users/user-id-1234/tasks').push({
            taskId: 'taskId',
            taskSpec: 'onOff',
            payload: {
                toggle: requestedClimateStatus,
                whatToToggle: "climate"
            }
        });
        conv.ask("Task pushed...s")
    }
}

async function processWindowsToggle() {

}

exports.processOnOffIntent = processOnOffIntent;