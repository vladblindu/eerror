const path = require('path')
const fs = require('fs')
const GenericError = require('./generic-error.class')
const {
    DEFINITION_FILE_SUFFIX,
    ERROR,
    NPACK
} = require('../__constants')

/**
 * @name fileToErrorClass
 * @description Converts a filename like "dev.def.js" to a error class name like DevError
 *
 * @param fn {string}
 * @returns {string}
 */
const fileToErrorClass = fn => fn[0].toUpperCase().concat(
    path.basename(fn)
        .slice(0, -1 * DEFINITION_FILE_SUFFIX.length)
        .slice(1)
        .replace(/[-_]([a-z])/g, g => g[1].toUpperCase()),
    ERROR)

/**
 * @name transfer
 * @description transfer te key/value pairs of object o to that object
 * Usually you would pass this as that and the properties you want to add to the instance in o
 *
 * @param that {object}
 * @param o {object}
 */
const transfer = (that, o) => Object.keys(o).forEach(k => {
    that[k] = o[k]
})


const getDefModules = pth => {
    try {
        // try to read all files in the pth directory
        return fs.readdirSync(pth)
    } catch (err) {
        // if anything goes wrong raise a generic error,
        // because the NodeError is not yet initialised
        throw new GenericError(
            err,
            pth ? `Could not read .def.js definition files in: ${pth}`
                : 'Error while reading error defs'
        )
    }
}

const filterFileNameList = lst =>
    // if a file name list is provided
    lst && lst.length
        // check they have the ".def.js" signature and that the
        ? fn => fn.endsWith(DEFINITION_FILE_SUFFIX) && lst.includes(fileToErrorClass(fn))
        : fn => fn.endsWith(DEFINITION_FILE_SUFFIX)


const getErrorClasses = (internalList, intPth, externalList, extPth) => {

    let internalClassList = []
    let externalClassList = []
    if (!internalList || internalList.length)
        // load all error class definitions from the package
        internalClassList = getDefModules(intPth)
            .filter(filterFileNameList(internalList))
            .map(fn => ({
                ...require(path.join(intPth, fn)),
                className: fileToErrorClass(fn)
            }))

    // if externalList and extPth are present , load the local error class defs too
    if (extPth && (!externalList || externalList.length))
        externalClassList = getDefModules(extPth)
            .filter(filterFileNameList(externalList))
            .map(fn => ({
                ...require(path.join(extPth, fn)),
                className: fileToErrorClass(fn)
            }))
    return compactDefsModules([...internalClassList, ...externalClassList])
}

const compactDefsModules = classDefList =>
    classDefList.reduce(
        (acc, classDef) => {
            const siblings = acc.filter(
                cls => cls.className === classDef.className
            )
            if (siblings.length > 0)
                siblings[0].targetErrors = {...siblings[0].targetErrors, ...classDef.targetErrors}
            else acc.push(classDef)
            return acc
        }, [])


const identify = (errorClasses, err) => {
    for (let cls in errorClasses)
        if (errorClasses.hasOwnProperty(cls) && errorClasses[cls].identify) {
            // get the errorClass
            const tmp = errorClasses[cls]
            // get it's targetErrors property value
            const identKeys = Object.keys(tmp.identify)
            for (let trgErr of identKeys) {
                // if we have a positive identification for the current errorClass and a targetError
                const key = tmp.identify[trgErr](err)
                if (key)
                    // return that errorClass and the targetErrors key
                    return {
                        [NPACK]: true,
                        errorClass: tmp,
                        targetError: trgErr,
                        key
                    }
            }
        }
    // else return false
    return false
}


const createError = (err, nPack) => nPack
    // if a specific class is received, generate a new normalized error
    ? new nPack.errorClass(err, nPack)
    // else generate a default error
    : new GenericError(err, 'No registered signature for the original error found.')

const normalizableClasses = errorClasses => {}

const initNormalize = errorClasses => err => err.className && err.errorName
    // if it's an BaseError instance return the error
    ? err
    // else create a new normalized error
    : createError(
        // by passing the incoming err object
        err,
        // and the identified errorClass, targetError - identify returns an array [errorClass, targetError]
        identify(errorClasses, err)
    )


module.exports = {
    transfer,
    fileToErrorClass,
    getDefModules,
    filterFileNameList,
    getErrorClasses,
    compactDefsModules,
    identify,
    createError,
    initNormalize
}