function processOnOffIntent(dbRoot, conv, thing, smarthome_toggle) {
    switch (thing) {
        case "air conditioning":
            processClimateToggle();
            break;
        case "windows":
            processWindowsToggle();
            break;
    }
    conv.ask(`${thing} successfully toggled to ${smarthome_toggle}`)
}

function processClimateToggle() {

}

function processWindowsToggle() {

}

exports.processOnOffIntent = processOnOffIntent;