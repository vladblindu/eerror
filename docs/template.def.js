// uncomment the following if you want to add http equivalents for your errors
//
// const {
//     BAD_REQUEST_ERROR,
//     UNAUTHORIZED_ERROR,
//     SERVER_ERROR,
//     NO_PERMISSION,
//     EXPIRED_ERROR
// } = require('../__constants')


// The fields that you want to add in your Extended errors for a specific errorTarget
const TEMPLATE_PAYLOAD = {
    'CUSTOM1_ERROR': {
        code: 'CSTERR'
        //http: SERVER_ERROR
    },
    'CUSTOM2_ERROR': {
        code: 'CSTERR'
        //http: SERVER_ERROR
    }

}
/* this is an example of the identify/normalize function of the firebase admin auth error
it's specific signature is the presence of the errorInfo field with two properties a code who's format
* */


const targetErrors = {
    'targetError': { // the type of error this identification/normalization pair targets
        identifier: err => { // the function that will be used to identify an incoming error as a "targetError" type
            if (!err['errorInfo'] && err['errorInfo'].code && /^auth\/.+/.test(err['errorInfo'].code))
                return false
            const codeToKey = firebaseCode => {
                return firebaseCode.replace('auth/', '').replace(/-/g, '_').toUpperCase()
            }
            for (let k of Object.keys(TEMPLATE_PAYLOAD))
                if (k === codeToKey(err['errorInfo'].code))
                    return k
            return false
        },
        normalizer: (err, k) => ({ // the function use to normalize the error to a standard ExtendedError
            ...TEMPLATE_PAYLOAD[k],
            errorName: k, // you should keep this name as a key of TEMPLATE_PAYLOAD for reference
            message: err['errorInfo'].message
        })
    }
}

const initializer = args => ({
    errorName: args[0],
    ...TEMPLATE_PAYLOAD[args[0]],
    hLog: args[1]
})


module.exports = {
    initializer,
    targetErrors,
    TEMPLATE_PAYLOAD // this is useful for testing
}
