const sha256 = require('js-sha256');

class Configuration {
    constructor() {
        this.userId = null;
        this.userDbRoot = null;
    }

    static setUserId(userId) {
        this.userId = sha256(userId);
    }

    static setUserDbRoot(dbRoot) {
        this.userDbRoot = dbRoot.child(`users/${this.userId}`)
    }
    static getUserDbRoot() {
        return this.userDbRoot;
    }
}

exports.Configuration = Configuration;