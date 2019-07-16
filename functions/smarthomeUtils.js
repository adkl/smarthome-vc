function setErrorResponse(conv, resolve, msg, milliseconds) {
    setTimeout(function() {
        conv.close(msg);
        resolve();
    }, milliseconds);
}
