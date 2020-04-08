const { UNAUTHORIZED_ERROR, SERVER_ERROR, NO_PERMISSION} = require('../__constants')

const NODE_PAYLOAD = {
    RESOURCE_ACCESS_ERROR: {
        code: 'EACCES',
        http: UNAUTHORIZED_ERROR
    },
    ADDRESS_IN_USE_ERROR: {
        code: 'EADDRINUSE',
        http: SERVER_ERROR
    },
    CONNECTION_REFUSED_ERROR: {
        code: 'ECONNREFUSED',
        http: SERVER_ERROR
    },
    CONNECTION_RESET_ERROR: {
        code: 'ECONNRESET',
        http: SERVER_ERROR
    },
    RESOURCE_EXISTS_ERROR: {
        code: 'EEXIST',
        http: SERVER_ERROR
    },
    RESOURCE_IS_DIRECTORY_ERROR: {
        code: 'EISDIR',
        http: SERVER_ERROR
    },
    TOO_MANY_OPEN_FILES_ERROR: {
        code: 'EMFILE',
        http: SERVER_ERROR
    },
    DNS_NOT_FOUND_ERROR: {
        code: 'ENOTFOUND',
        http: SERVER_ERROR
    },
    RESOURCE_IS_NOT_DIRECTORY_ERROR: {
        code: 'ENOTDIR',
        http: SERVER_ERROR
    },
    RESOURCE_IS_NOT_EMPTY: {
        code: 'ENOTEMPTY',
        http: SERVER_ERROR
    },
    RESOURCE_NOT_FOUND_ERROR: {
        code: 'ENOENT',
        http: SERVER_ERROR
    },
    NO_PERMISSION_ERROR: {
        code: 'EPERM',
        http: NO_PERMISSION
    },
    BROKEN_PIPE_ERROR: {
        code: 'EPIPE',
        http: SERVER_ERROR
    },
    TIMEOUT_ERROR: {
        code: 'ETIMEDOUT',
        http: SERVER_ERROR
    }
}

const targetErrors = {
    'standardNodeError': {
        identifier: err => {
            for(let k of Object.keys(NODE_PAYLOAD))
                if(NODE_PAYLOAD[k].code === err.code)
                    return k
            return false
        },
        normalizer: (err, k) => ({
            ...NODE_PAYLOAD[k],
            errorName: k,
            message: err.message
        })
    }
}

const initializer = args => ({
    errorName: args[0],
    ...NODE_PAYLOAD[args[0]],
    hLog: args[1]
})


module.exports = {
    initializer,
    targetErrors,
    NODE_PAYLOAD
}
