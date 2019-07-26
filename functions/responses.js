function temperatureResponse(temperature) {
    return `It is currently ${temperature} degrees.`
}
function humidityResponse(humidity) {
    return `The air in your home is ${humidity}% wet.`
}
function genericErrorResponse() {
    return "There is an error in contacting the smart home controller."
}

exports.genericErrorResponse = genericErrorResponse;