/*
    Integration test for AuthError class errors
 */
const {expect} = require('chai')
const {registerErrorClasses} = require('../')
const {FIREBASE_PAYLOAD} = require('../defs/auth.def')
const {HTTP_PAYLOAD} = require('../__constants')

const AUTH_ERROR = 'AuthError'
const DUMMY_TEXT = 'DUMMY TEXT'
const TEST_ERROR = 'TEST_ERROR'

describe('INTEGRATION TEST - AuthError', () => {

    const opts = {
        internalList: [AUTH_ERROR]
    }

    // class test
    it('should load', () => {
        const classes = registerErrorClasses(opts)
        const AuthError = classes[AUTH_ERROR]
        expect(classes).to.have.keys(AUTH_ERROR, 'normalize')
        expect(Object.keys(classes).length).to.equal(2)
        expect(new AuthError(DUMMY_TEXT)).to.have.instanceOf(AuthError)
    })

    // instance test
    it('should have a functional instance', () => {
        const classes = registerErrorClasses(opts)
        const AuthError = classes[AUTH_ERROR]
        const expected = new AuthError(TEST_ERROR, DUMMY_TEXT)
        expect(expected.className).to.equal(AUTH_ERROR)
        expect(expected.errorName).to.equal(TEST_ERROR)
        expect(expected.hLog).to.equal(DUMMY_TEXT)
    })

    // identification test
    it('should identify a standard auth error instance', () => {

        const classes = registerErrorClasses(opts)
        const {normalize} = classes

        const err = new Error(DUMMY_TEXT)
        err.errorInfo = {
            code: 'auth/missing-continue-uri',
            message: DUMMY_TEXT
        }
        const eErr = normalize(err)
        const {className, errorName, code, message} = eErr
        expect(className).to.equal('AuthError')
        expect(errorName).to.equal('MISSING_CONTINUE_URI')
        expect(code).to.equal('MCONTURIERR')
        expect(message).to.equal(DUMMY_TEXT)
        expect(eErr.stack).to.be.ok
        expect(eErr.log).to.be.ok
        expect(eErr.test).to.be.ok
        expect(eErr.toHttp()).to.equal(HTTP_PAYLOAD[eErr.http])
    })

    // integration test
    it('Should normalize all errors', () => {

        const classes = registerErrorClasses(opts)
        const {normalize} = classes

        const errors = Object.keys(FIREBASE_PAYLOAD).map(k => {
            const err = new Error(DUMMY_TEXT)
            err.errorInfo = {
                code: 'auth/' + k.replace(/_/g, '-').toLowerCase(),
                message: DUMMY_TEXT
            }
            return err
        })

        errors.forEach(err => {
            const eErr = normalize(err)
            const {className, errorName, code, message} = eErr
            expect(className).to.equal('AuthError')
            expect(errorName).to.equal(eErr.errorName)
            expect(code).to.equal(eErr.code)
            expect(message.length).to.be.greaterThan(0)
            expect(eErr.stack).to.be.ok
            expect(eErr.log).to.be.ok
            expect(eErr.test).to.be.ok
            expect(eErr.toHttp()).to.equal(HTTP_PAYLOAD[eErr.http])
        })
    })
})
