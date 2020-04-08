const path = require('path')
const ExtendedError = require('./src/eerror.class')
const {getErrorClasses, initNormalize} = require('./src/helpers')
const {DEFINITIONS_DIR} = require('./__constants')

/**
 * @name registerErrorClasses
 *
 * @param opts {object}
 * @param opts.internalList {Array}
 * @param opts.externalList {Array}
 * @param opts.path {string}
 * @returns {*}
 */

const registerErrorClasses = (opts = {}) => {
    // if no internal path is provided _intPth gets the default internal value
    // this might sound redundant but it helps unit testing
    const intPath = path.join(__dirname, DEFINITIONS_DIR)
    // get all class definition objects from disk
    const classes = getErrorClasses(opts['internalList'], intPath, opts['externalList'], opts.path).reduce(
        (acc, classDef) => {
            if (!(process && classDef['onEnvLoad'] && process.env.NODE_ENV !== classDef['onEnvLoad']))
                acc[classDef.className] = class extends ExtendedError(classDef) {
                }
            return acc
        }, {})
    return {
        ...classes,
        normalize: initNormalize(classes)
    }
}

module.exports = {
    registerErrorClasses
}
