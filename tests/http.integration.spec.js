/*
    Integration test for HttpError class errors
 */
const {expect} = require('chai')
const {registerErrorClasses} = require('../index')
const {HTTP_PAYLOAD, SERVER_ERROR} = require('../__constants')


const HTTP_ERROR = 'HttpError'
const DUMMY_TEXT = 'DUMMY TEXT'
const TEST_ERROR = 'TEST_ERROR'

describe('INTEGRATION TEST - HttpError', () => {

    const opts = {
        internalList: [HTTP_ERROR]
    }
    
    // class test
    it('should load', () => {
        const classes = registerErrorClasses(opts)
        const HttpError = classes[HTTP_ERROR]
        expect(classes).to.have.keys(HTTP_ERROR, 'normalize')
        expect(Object.keys(classes).length).to.equal(2)
        expect(new HttpError(DUMMY_TEXT)).to.have.instanceOf(HttpError)
    })

    // instance test
    it('should have a functional instance', () => {
        const classes = registerErrorClasses(opts)
        const HttpError = classes[HTTP_ERROR]
        const expected = new HttpError(TEST_ERROR, DUMMY_TEXT)
        expect(expected.className).to.equal(HTTP_ERROR)
        expect(expected.errorName).to.equal(TEST_ERROR)
        expect(expected.hLog).to.equal(DUMMY_TEXT)
    })

    // identification test
    it('should identify a standard http error instance', () => {
        const err = new Error('Server error')
        err.status= 500
        const classes = registerErrorClasses(opts)
        const {normalize} = classes
        const eErr = normalize(err)
        const {className, errorName, code, status, message} = eErr
        expect(className).to.equal('HttpError')
        expect(errorName).to.equal(SERVER_ERROR)
        expect(code).to.equal(HTTP_PAYLOAD[SERVER_ERROR].code)
        expect(status).to.equal(HTTP_PAYLOAD[SERVER_ERROR].status)
        expect(message).to.equal(HTTP_PAYLOAD[SERVER_ERROR].message)
        expect(eErr.stack).to.be.ok
        expect(eErr.log).to.be.ok
        expect(eErr.test).to.be.ok
        expect(eErr.toHttp()).to.equal(eErr)
    })

    // integration test
    it('Should normalize all errors', () => {

        const classes = registerErrorClasses(opts)
        const {normalize} = classes

        const errors = Object.keys(HTTP_PAYLOAD).map(k => {
            const err = new Error(HTTP_PAYLOAD[k].message)
            err.status = HTTP_PAYLOAD[k].status
            return err
        })

        errors.forEach( err => {
            const eErr = normalize(err)
            const {className, errorName, status, message} = eErr
            expect(className).to.equal(HTTP_ERROR)
            expect(errorName).to.equal(eErr.errorName)
            expect(status).to.equal(eErr.status)
            expect(message.length).to.be.greaterThan(0)
            expect(eErr.stack).to.be.ok
            expect(eErr.log).to.be.ok
            expect(eErr.test).to.be.ok
            expect(eErr.toHttp()).to.equal(eErr)
        })
    })
})
