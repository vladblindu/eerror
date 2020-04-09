const path = require('path')
const fs = require('fs')
const {expect} = require('chai')
const {registerErrorClasses} = require('../index')
const {fileToErrorClass, ExtendedError} = require('../src/helpers')
const {DEFINITIONS_DIR} = require('../__constants')

describe('INTEGRATION TEST - main build', () => {

    const {errorClasses, normalize} = registerErrorClasses()

    it('Should load all defined error classes', () => {

        const pathToDefs = path.resolve(path.join(__dirname, '../', DEFINITIONS_DIR)
        )
        let defs = []
        try{
            defs = fs.readdirSync(pathToDefs)
        }
        catch(e){
            if(e) {
                console.log(e)
                process.exit(500)
            }
            const classNames = defs.map(d => fileToErrorClass(d))
            classNames.forEach(
                cls => {
                    expect(errorClasses[cls]).to.have.instanceOf(ExtendedError)
                }
            )
        }
    })

    it('Should normalize a node error', () => {

        const err = {
            code: 'ECONNRESET',
            message: 'Connection reset by peer.'
        }
        const eErr = normalize(err)
        expect(eErr.className).to.equal('NodeError')
        expect(eErr.message).to.equal('Connection reset by peer.')
        expect(eErr.errorName).to.equal('CONNECTION_RESET_ERROR')
    })

    it('Should normalize a http error', () => {

        const err = {
            status: 403
        }
        const eErr = normalize(err)
        expect(eErr.className).to.equal('HttpError')
        expect(eErr.message).to.equal('Invalid credentials for requested resource')
        expect(eErr.errorName).to.equal('NO_PERMISSION_ERROR')
    })

    it('Should normalize a auth/firebase error', () => {

        const err = {
            errorInfo: {
                code: "auth/id-token-expired",
                message: 'Id token has expired'
            }
        }
        const eErr = normalize(err)
        expect(eErr.className).to.equal('AuthError')
        expect(eErr.message).to.equal('Id token has expired')
        expect(eErr.code).to.equal('TKNEXPERR')
    })
})