const {red, magenta, yellow} = require('chalk')
const {transfer} = require('./helpers')
const {NPACK, HTTP_PAYLOAD, ERROR_SUFFIX} = require('../__constants')

/**
 * @class EError
 * @description The class that creates the error classes according to the classDefs object
 *
 * @param defData {object}
 * @returns {BaseError}
 * @constructor
 */
const EError = defData => {
    /**
     * @class BaseError
     * @description a wrapper ove the standard javascript that adds the
     * package specific properties and signatures
     */
    class BaseError extends Error {
        constructor() {
            const args = Array.from(arguments)
            super()
            if (typeof args[0] === 'object' && args[1][NPACK]) {
                transfer(this, {
                    ...defData.targetErrors[args[1].targetError].normalizer(args[0], args[1].key),
                    targetError: args[1]
                })
            } else transfer(this, defData.initializer(args))

            if (!this.stack)
                Error.captureStackTrace(this, this.constructor)

            this.className = defData.className
        }

        /**
         * @method log
         * @description A fancy and colored way to log errors,
         * waiting for a custom method passed via opts in the TODO state
         */
        log() {
            console.log(magenta(`${this.className} - Error: ${this.errorName}`))
            if (this.hLog) console.log(red('HUMAN LOG: ') + this.hLog)
            if (this.message) console.log(yellow('MACHINE LOG: ') + this.message)
            if (this['multi']) {
                console.log(yellow('Validation errors: '))
                Object.keys(this['multi'].map(
                    k => {
                        console.log(yellow(k) + ': ' + this['multi'][k])
                    }
                ))
            }
            if (this.stack) console.log(this.stack)
            console.log(magenta('--------------------------------------------\n'))
        }

        /**
         * @method toHttp
         * @description A fast way to translate any error into a http response
         *
         * @returns {object}
         */
        toHttp() {
            return this.className === 'HttpError'
                ? this
                : HTTP_PAYLOAD[this['http']]
        }

        /**
         * @method test
         *@description
         *
         * @param className
         * @param errorName
         * @returns {boolean|boolean}
         */
        test(className, errorName) {
            const nameOrCode = errorName.endsWith(ERROR_SUFFIX)
                ? this.errorName === errorName
                : this.code === errorName
            return className === this.className && nameOrCode
        }
    }

    /**
     * @description If this is a class that requires normalization define it
     * add the static identify property for every targetError type
     */
    if (defData.targetErrors)
        BaseError.identify = Object.keys(defData.targetErrors).reduce(
            (acc, k) => {
                acc[k] = defData.targetErrors[k].identifier
                return acc
            }, {})

    return BaseError
}

module.exports = EError