const {SERVER_ERROR} = require('../__constants')

const fields = {
    INVALID_ARGUMENT_TYPE: {
        code: 'ARGERR',
        http: SERVER_ERROR,
        message: 'Invalid argument type provided to function'
    }
}

const initializer = args => ({
    errorName: args[0],
    ...fields[args[1]],
    hLog: args[1]
})

module.exports = {
    initializer
}