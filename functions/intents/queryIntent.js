async function processQueryIntent(dbRoot, conv, query_item) {
    switch (query_item) {
        case "temperature":
            const temperature = await getCurrentTemperature(dbRoot);
            conv.ask(`The current temperature is ${temperature}.`);
            break;
        case "humidity":
            const humidity = await getCurrentHumidity(dbRoot);
            conv.ask(`Current air humidity in your home is ${humidity}.`);
            break;
        default:
            conv.ask(`It seems you don't have a ${query_item} in your home.`);
            break;
    }
}

async function getCurrentTemperature(dbRoot) {
    const snapshot = await dbRoot.child(`users/user-id-1234/temperature`).once('value');
    return snapshot.val();
}

async function getCurrentHumidity(dbRoot) {
    const snapshot = await dbRoot.child(`users/user-id-1234/humidity`).once('value');
    return snapshot.val();
}

exports.processQueryIntent = processQueryIntent;

