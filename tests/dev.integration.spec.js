/*
    Integration test for DevError class errors
 */

const {expect} = require('chai')
const {registerErrorClasses} = require('../index')

const DEV_ERROR = 'DevError'
const DUMMY_TEXT = 'DUMMY TEXT'
const TEST_ERROR = 'TEST_ERROR'

describe('DEV_ERROR', () => {

    const opts = {
        internalList: [DEV_ERROR]
    }

    // class test
    it('should load', () => {
        const classes = registerErrorClasses(opts)
        const DevError = classes[DEV_ERROR]
        expect(classes).to.have.keys(DEV_ERROR, 'normalize')
        expect(Object.keys(classes).length).to.equal(2)
        expect(new DevError(DUMMY_TEXT)).to.have.instanceOf(DevError)
    })
    // instance test
    it('should have a functional instance', () => {
        const classes = registerErrorClasses(opts)
        const DevError = classes[DEV_ERROR]
        const expected = new DevError(TEST_ERROR, DUMMY_TEXT)
        expect(expected.className).to.equal(DEV_ERROR)
        expect(expected.errorName).to.equal(TEST_ERROR)
        expect(expected.hLog).to.equal(DUMMY_TEXT)
    })
})
