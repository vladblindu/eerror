const {HTTP_PAYLOAD} = require('../__constants')

const targetErrors = {
    'standardHttpError': {
        identifier: err => {
            if(!err.status) return false
            let status
            if(typeof err.status !== 'number'){
                status = parseInt(err.status)
                if(isNaN(status)) return false
            } else status = err.status
            if(status < 200) return false
            for(let k of Object.keys(HTTP_PAYLOAD))
                if(HTTP_PAYLOAD[k].status === status)
                    return k
            return false
        },
        normalizer: (err, k) => ({
                ...HTTP_PAYLOAD[k],
                errorName: k
            })
    }
}

const initializer = args => ({
    errorName: args[0],
    ...HTTP_PAYLOAD[args[0]],
    hLog: args[1]
})


module.exports = {
    initializer,
    targetErrors
}
