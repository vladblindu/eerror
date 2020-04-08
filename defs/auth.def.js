const {
    BAD_REQUEST_ERROR,
    UNAUTHORIZED_ERROR,
    SERVER_ERROR,
    NO_PERMISSION,
    EXPIRED_ERROR
} = require('../__constants')

const FIREBASE_PAYLOAD = {
    'CLAIMS_TOO_LARGE': {
        code: 'CLLGERR',
        http: SERVER_ERROR
    },
    'EMAIL_ALREADY_EXISTS': {
        code: 'EMEERR',
        http: SERVER_ERROR
    },
    'ID_TOKEN_EXPIRED': {
        code: 'TKNEXPERR',
        http: EXPIRED_ERROR
    },
    'ID_TOKEN_REVOKED': {
        code: 'TKNREVERR',
        http: UNAUTHORIZED_ERROR
    },
    'INSUFFICIENT_PERMISSION': {
        code: 'NOPERMERR',
        http: NO_PERMISSION
    },
    'INTERNAL_ERROR': {
        code: 'SRVERR',
        http: SERVER_ERROR
    },
    'INVALID_ARGUMENT': {
        code: 'ARGERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_CLAIMS': {
        code: 'INVCLMERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_CONTINUE_URI': {
        code: 'INVCURLERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_CREATION_TIME': {
        code: 'INVCTERR',
        http: EXPIRED_ERROR
    },
    'INVALID_CREDENTIAL': {
        code: 'INVCRDERR',
        http: UNAUTHORIZED_ERROR
    },
    'INVALID_DISABLED_FIELD': {
        code: 'INVDISFLDERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_DISPLAY_NAME': {
        code: 'INVDNERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_DYNAMIC_LINK_DOMAIN': {
        code: 'INVDLDERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_EMAIL': {
        code: 'INVEMERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_EMAIL_VERIFIED': {
        code: 'INVEVERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_HASH_ALGORITHM': {
        code: 'INVALGERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_HASH_BLOCK_SIZE': {
        code: 'INVBSERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_HASH_DERIVED_KEY_LENGTH': {
        code: 'INVDKLERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_HASH_KEY': {
        code: 'INVHKERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_HASH_MEMORY_COST': {
        code: 'INVMCERR',
        http: SERVER_ERROR
    },
    'INVALID_HASH_PARALLELIZATION': {
        code: 'INVHPERR',
        http: SERVER_ERROR
    },
    'INVALID_HASH_ROUNDS': {
        code: 'INVHRERR',
        http: SERVER_ERROR
    },
    'INVALID_HASH_SALT_SEPARATOR': {
        code: 'INVHSSERR',
        http: SERVER_ERROR
    },
    'INVALID_ID_TOKEN': {
        code: 'INVIDTKERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_LAST_SIGN_IN_TIME': {
        code: 'INVLSTERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_PAGE_TOKEN': {
        code: 'INVPTKERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_PASSWORD': {
        code: 'INVPASSERR',
        http: UNAUTHORIZED_ERROR
    },
    'INVALID_PASSWORD_HASH': {
        code: 'INVPSHERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_PASSWORD_SALT': {
        code: 'INVPSSERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_PHONE_NUMBER': {
        code: 'INVPHNERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_PHOTO_URL': {
        code: 'INVPHURLERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_PROVIDER_DATA': {
        code: 'INVIPDERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_PROVIDER_ID': {
        code: 'INVIPIERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_SESSION_COOKIE_DURATION': {
        code: 'INVSCDERR',
        http: SERVER_ERROR
    },
    'INVALID_UID': {
        code: 'INVIUIDERR',
        http: BAD_REQUEST_ERROR
    },
    'INVALID_USER_IMPORT': {
        code: 'INVUIMPERR',
        http: SERVER_ERROR
    },
    'MAXIMUM_USER_COUNT_EXCEEDED': {
        code: 'MUCNTERR',
        http: SERVER_ERROR
    },
    'MISSING_ANDROID_PKG_NAME': {
        code: 'MAPKNERR',
        http: BAD_REQUEST_ERROR
    },
    'MISSING_CONTINUE_URI': {
        code: 'MCONTURIERR',
        http: BAD_REQUEST_ERROR
    },
    'MISSING_HASH_ALGORITHM': {
        code: 'MHALGERR',
        http: BAD_REQUEST_ERROR
    },
    'MISSING_IOS_BUNDLE_ID': {
        code: 'MIOSBIDERR',
        http: BAD_REQUEST_ERROR
    },
    'MISSING_UID': {
        code: 'MUIDERR',
        http: BAD_REQUEST_ERROR
    },
    'OPERATION_NOT_ALLOWED': {
        code: 'OPNAWDERR',
        http: SERVER_ERROR
    },
    'PHONE_NUMBER_ALREADY_EXISTS': {
        code: 'PHNEERR',
        http: SERVER_ERROR
    },
    'PROJECT_NOT_FOUND': {
        code: 'PJNFOUNDERR',
        http: SERVER_ERROR
    },
    'RESERVED_CLAIMS': {
        code: 'RESCLMERR',
        http: SERVER_ERROR
    },
    'SESSION_COOKIE_EXPIRED': {
        code: 'EXPCKERR',
        http: SERVER_ERROR
    },
    'SESSION_COOKIE_REVOKED': {
        code: 'REVCKERR',
        http: UNAUTHORIZED_ERROR
    },
    'UID_ALREADY_EXISTS': {
        code: 'UIDEXERR',
        http: SERVER_ERROR
    },
    'UNAUTHORIZED_CONTINUE_URI': {
        code: 'UNCURIERR',
        http: UNAUTHORIZED_ERROR
    },
    'USER_NOT_FOUND': {
        code: 'USRNFOUNDERR',
        http: UNAUTHORIZED_ERROR
    }
}

const targetErrors = {
    'firebaseAuthError': {
        identifier: err => {
            // check the errors signature firs
            if(!(err.errorInfo && err.errorInfo.code.startsWith('auth/')))
                return false
            const codeToKey = firebaseCode => {
                return firebaseCode.replace('auth/', '').replace(/-/g, '_').toUpperCase()
            }
            for (let k of Object.keys(FIREBASE_PAYLOAD))
                if (k === codeToKey(err['errorInfo'].code))
                    return k
            return false
        },
        normalizer: (err, k) => ({
            ...FIREBASE_PAYLOAD[k],
            errorName: k,
            message: err['errorInfo'].message
        })
    }
}

const initializer = args => ({
    errorName: args[0],
    ...FIREBASE_PAYLOAD[args[0]],
    hLog: args[1]
})


module.exports = {
    initializer,
    targetErrors,
    FIREBASE_PAYLOAD
}
