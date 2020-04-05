var sha256 = require('js-sha256');

class Configuration {
    constructor() {
        this.userId = null;
        this.userDbRoot = null;
    }

    static setUserId(userId) {
        this.userId = sha256(userId);
    }
    static getUserId() {
        return this.userId;
    }

    static setUserDbRoot(dbRoot) {
        if (this.userId === null) {
            // error
        }
        else {
            this.userDbRoot = dbRoot.child(`users/${this.userId}`)
        }
    }
    static getUserDbRoot() {
        return this.userDbRoot;
    }
    static getAppClientId() {

    }
}

exports.Configuration = Configuration;