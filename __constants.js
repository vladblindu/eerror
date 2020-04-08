const ERROR_SUFFIX = '_ERROR'
const ERROR = 'Error'
const DEFINITION_FILE_SUFFIX = '.def.js'
const DEFINITIONS_DIR = 'defs'
const NPACK = 'NPACK'


// http error names
const SERVER_ERROR = 'SERVER_ERROR'
const UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR'
const NO_PERMISSION_ERROR = 'NO_PERMISSION_ERROR'
const BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR'
const EXPIRED_ERROR = 'EXPIRED_ERROR'

const HTTP_PAYLOAD = {
    [BAD_REQUEST_ERROR]: {
        status: 400,
        code: 'BDRQERR',
        message: 'Bad request'
    },
    [UNAUTHORIZED_ERROR]: {
        status: 401,
        code:'UNAUTHERR',
        message: 'Unauthorized access.'
    },
    [NO_PERMISSION_ERROR]: {
        status: 403,
        code: 'NOPERMERR',
        message: 'Invalid credentials for requested resource'
    },
    [SERVER_ERROR]: {
        status: 500,
        code: 'SRVERR',
        message: 'internal server error.'
    },
    [EXPIRED_ERROR]: {
        status: 401,
        code: 'EXPERR',
        message: 'Your token has expired. Please request a new one.'
    }
}

module.exports = {
    ERROR,
    NPACK,
    DEFINITIONS_DIR,
    HTTP_PAYLOAD,
    DEFINITION_FILE_SUFFIX,
    ERROR_SUFFIX,
    SERVER_ERROR,
    UNAUTHORIZED_ERROR,
    NO_PERMISSION_ERROR,
    BAD_REQUEST_ERROR,
    EXPIRED_ERROR
}