const {red, magenta, yellow} = require('chalk')
const {HTTP_PAYLOAD, SERVER_ERROR} = require('../__constants')

/**
 * @class GenericError
 * @description A generic error to be used if errors might show up in this package before all error
 * classes have been registered or if an incoming error can't be normalized to any of the registered classes
 */
class GenericError extends Error {
    constructor(err) {
        super()
        if (arguments[0] && typeof arguments[0] === 'string') this.hLog = arguments[0]
        else if (arguments[1]) this.hLog = arguments[1]
        this.message = err.message
        this.stack = err.stack || Error.captureStackTrace(this, this.constructor)
        this.className = 'GenericError'
        this.code = 'GENERR'
        this.errorName = 'GENERIC_ERROR'

    }

    log() {
        console.log(magenta('----------------- EError ---------------------'))
        if (this.hLog) console.log(red('HUMAN LOG: ') + this.hLog)
        if (this.message) console.log(yellow('MACHINE LOG: ') + this.message)
        if (this.stack) console.log(this.stack)
        console.log(magenta('--------------------------------------------\n'))
    }

    toHttp() {
        return HTTP_PAYLOAD[SERVER_ERROR]
    }

    test(className) {
        return className === 'GenericError'
    }
}

module.exports = GenericError