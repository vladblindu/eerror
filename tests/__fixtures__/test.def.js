const {SERVER_ERROR, UNAUTHORIZED_ERROR} = require('../../__constants')

const fields = {
    'TEST1_ERROR': {
        code: 'TST1ERR',
        message: 'Test 1 error message',
        testField: 'Signature field - 1',
        http: SERVER_ERROR
    },
    'TEST2_ERROR': {
        code: 'TST2ERR',
        message: 'Test 2 error message',
        testField: 'Signature field - 2',
        http: UNAUTHORIZED_ERROR
    }
}

const initializer = args => {
    return {
        errorName: args[0],
        ...fields[args[0]],
        hLog: args[1] || ''
    }
}

module.exports = {
    initializer,
    targetErrors: {
        standardTestError: {
            identifier: () => {},
            normalizer: () => {}
        }
    }
}
