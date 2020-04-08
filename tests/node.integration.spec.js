/*
    Integration test for NodeError class errors
 */
const fs = require('fs')
const {expect} = require('chai')
const {registerErrorClasses} = require('../')
const {NODE_PAYLOAD} = require('../defs/node.def')
const {HTTP_PAYLOAD} = require('../__constants')

const NODE_ERROR = 'NodeError'
const DUMMY_TEXT = 'DUMMY TEXT'
const TEST_ERROR = 'TEST_ERROR'

describe('INTEGRATION TEST - NodeError', () => {
    
    const opts = {
       internalList: [NODE_ERROR] 
    }
    
    // class test
    it('should load', () => {
        const classes = registerErrorClasses(opts)
        const NodeError = classes[NODE_ERROR]
        expect(classes).to.have.keys(NODE_ERROR, 'normalize')
        expect(Object.keys(classes).length).to.equal(2)
        expect(new NodeError(DUMMY_TEXT)).to.have.instanceOf(NodeError)
    })

    // instance test
    it('should have a functional instance', () => {
        const classes = registerErrorClasses(opts)
        const NodeError = classes[NODE_ERROR]
        const expected = new NodeError(TEST_ERROR, DUMMY_TEXT)
        expect(expected.className).to.equal(NODE_ERROR)
        expect(expected.errorName).to.equal(TEST_ERROR)
        expect(expected.hLog).to.equal(DUMMY_TEXT)
    })

    // identification test
    it('should identify a standard node error instance', () => {

        const classes = registerErrorClasses(opts)
        const {normalize} = classes

        try {
            fs.readdirSync('non-existing-path')
        } catch (err) {
            const eErr = normalize(err)
            const {className, errorName, code, message} = eErr
            expect(className).to.equal('NodeError')
            expect(errorName).to.equal('RESOURCE_NOT_FOUND_ERROR')
            expect(code).to.equal('ENOENT')
            expect(message).to.equal('ENOENT: no such file or directory, scandir \'non-existing-path\'')
            expect(eErr.stack).to.be.ok
            expect(eErr.log).to.be.ok
            expect(eErr.test).to.be.ok
            expect(eErr.toHttp()).to.equal(HTTP_PAYLOAD[eErr.http])
        }
    })

    // integration test
    it('Should normalize all errors', () => {

        const classes = registerErrorClasses(opts)
        const {normalize} = classes

        const errors = Object.keys(NODE_PAYLOAD).map(k => {
            const err = new Error(DUMMY_TEXT)
            err.code = NODE_PAYLOAD[k].code
            return err
        })

        errors.forEach( err => {
            const eErr = normalize(err)
            const {className, errorName, code, message} = eErr
            expect(className).to.equal('NodeError')
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
