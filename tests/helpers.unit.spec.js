const path = require('path')
const {expect} = require('chai')
const ExtendedError  =require('../src/eerror.class')
const GenericError = require('../src/generic-error.class')
const {registerErrorClasses} = require('../')

const {
    getDefModules,
    filterFileNameList,
    getErrorClasses,
    compactDefsModules,
    fileToErrorClass,
    identify,
    createError,
    initNormalize
} = require('../src/helpers')
const testErrorDef = require('./__fixtures__/test.def')
const {HTTP_PAYLOAD, UNAUTHORIZED_ERROR, NPACK} = require('../__constants')

const DUMMY_MESSAGE = 'Dummy message'
const TEST_ERROR = 'TEST_ERROR'

describe('UNIT TEST - Helpers', () => {

    describe('fileToErrorClass', () => {
        it('Should convert correctly a simple string', () => {
            expect(fileToErrorClass('test1.def.js')).to.equal('Test1Error')
        })
        it('Should convert correctly a dash string', () => {
            expect(fileToErrorClass('test1-tester.def.js')).to.equal('Test1TesterError')
        })
        it('Should convert correctly a underscore string', () => {
            expect(fileToErrorClass('test1_tester.def.js')).to.equal('Test1TesterError')
        })
        it('Should convert correctly a multiple dash/underscore string', () => {
            expect(fileToErrorClass('test1_tester-test2_test.def.js')).to.equal('Test1TesterTest2TestError')
        })
    })

    describe('ExtendedError', () => {

        testErrorDef.className = 'TestError'
        const tmp = {
            TestError: class extends ExtendedError(testErrorDef) {
            }
        }

        const TestError = tmp['TestError']

        it('Should return a TestError instance', () => {
            const testError = new TestError('TEST1_ERROR', 'Human log test')
            expect(testError).to.have.instanceOf(TestError)
        })

        it('Should return a Error instance', () => {
            const testError = new TestError('TEST1_ERROR', 'Human log test')
            expect(testError).to.have.instanceOf(Error)
        })

        it('Should have all static methods', () => {
            expect(TestError.identify).to.have.key('standardTestError')
        })

        it('Should have all methods', () => {
            const testError = new TestError('TEST1_ERROR', 'Human log test')
            expect(testError.log).to.be.ok
            expect(testError.toHttp).to.be.ok
            expect(testError.test).to.be.ok
        })

        it('Should have inherited message and stack from Error', () => {
            const testError = new TestError('TEST1_ERROR', 'Human log test')
            expect(testError.stack).to.be.ok
            expect(testError.message).to.not.be.undefined
        })

        it('Should have the right properties', () => {
            const testError = new TestError('TEST1_ERROR', 'Human log test')
            expect(testError).to.have.instanceOf(Error)
        })

        it('Should have all the custom props&methods', () => {
            const testError = new TestError('TEST1_ERROR', 'Human log test')
            expect(testError.errorName).to.equal('TEST1_ERROR')
            expect(testError.message).to.equal('Test 1 error message')
            expect(testError.code).to.equal('TST1ERR')
            expect(testError.hLog).to.equal('Human log test')
        })

        it('Should log correctly', () => {
            const safeLog = console.log

            console.log = msg => {
                console.log(msg)
                expect(msg).to.contain('Human log test')
                expect(msg).to.contain('Test 1 error message')
            }

            const testError = new TestError('TEST1_ERROR', 'Human log test')
            console.log = safeLog
            testError.log()
        })

        it('Should return the right http payload', () => {
            const testError = new TestError('TEST2_ERROR', 'Human log test')
            expect(testError.toHttp()).to.deep.equal(HTTP_PAYLOAD[UNAUTHORIZED_ERROR])
        })

        it('Should return the right test value', () => {
            const testError = new TestError('TEST2_ERROR', 'Human log test')
            expect(testError.test('TestError', 'TEST2_ERROR')).to.be.true
            expect(testError.test('TestError', 'TST2ERR')).to.be.true
        })

        it('Should call the normalizer function if the firs arg is an object', () => {
            const mockNormalizer = err => {
                expect(err).to.deep.equal([{test: 'err'}])
                return {}
            }

            const mokDef = {...testErrorDef, normalizer: mockNormalizer}
            const tmp = {
                TestError: class extends ExtendedError(mokDef) {
                }
            }

            const TestError = tmp['TestError']
            new TestError({test: 'err'}, 'standardTestError')
        })
    })

    describe('compactDefsModules', () => {

        it('Should compact overlapping classes', () => {
            const def1 = {
                className: 'TestError',
                targetErrors: {
                    standardTest1Error: {},
                    otherTest1Error: {}
                }
            }
            const def2 = {
                className: 'TestError',

                targetErrors: {
                    standardTest2Error: {},
                    otherTest2Error: {}
                }
            }
            const def3 = {
                className: 'Test3Error',
                targetErrors: {
                    standardTest3Error: {},
                    otherTest3Error: {}
                }
            }
            const expected = compactDefsModules([def1, def2, def3])
            expect(expected).to.have.members([def1, def3])
            expect(expected[0].targetErrors.otherTest2Error).to.be.ok
        })

        it('Should leave non-overlapping classes', () => {
            const def1 = {
                className: 'TestError',
                targetErrors: {
                    standardTest1Error: {},
                    otherTest1Error: {}
                }
            }
            const def2 = {
                className: 'Test2Error',

                targetErrors: {
                    standardTest2Error: {},
                    otherTest2Error: {}
                }
            }
            const def3 = {
                className: 'Test3Error',
                targetErrors: {
                    standardTest3Error: {},
                    otherTest3Error: {}
                }
            }
            const expected = compactDefsModules([def1, def2, def3])
            expect(expected).to.have.members([def1, def2, def3])
            expect(expected[0].targetErrors.otherTest2Error).to.be.undefined
        })
    })

    describe('getDefModules', () => {

        const fixturePath = path.join(__dirname, '__fixtures__')

        it('Should get the right files', () => {
            const defFiles = getDefModules(fixturePath)
            expect(defFiles).to.have.members([
                'test.def.js',
                'test1.def.js',
                'test2.def.js',
                'test3.def.js',
                'test-wrong.defs.js'
            ])
        })

        it('Should throw a generic error on invalid path', () => {
            try {
                getDefModules('un-existing-path')
            } catch (err) {
                expect(err.message).to.equal(
                    'ENOENT: no such file or directory, scandir \'un-existing-path\''
                )
                expect(err.className).to.equal('GenericError')
                expect(err.code).to.equal('GENERR')
            }
        })
    })

    describe('filterFileNameList', () => {

        it('Should return the right filter for provided list', () => {

            const testList = [
                'Test1Error',
                'Test2Error'
            ]

            const filt = filterFileNameList(testList)
            expect(filt('test1.def.js')).to.be.true
            expect(filt('test2.def.js')).to.be.true
            expect(filt('test3.def.js')).to.be.false
            expect(filt('malformed.defs.js')).to.be.false
        })

        it('Should return the right filter for no list', () => {
            const filt = filterFileNameList()
            expect(filt('test1.def.js')).to.be.true
            expect(filt('malformed.defs.js')).to.be.false
        })
    })

    describe('getErrorClasses', () => {

        const fixturePath = path.join(__dirname, '__fixtures__')

        it('Should get the right files', () => {


            const expected = getErrorClasses([], '', undefined, fixturePath)

            expect(expected.map(el => el.className)).to.have.members(
                ['TestError', 'Test1Error', 'Test2Error', 'Test3Error']
            )
            expected.forEach(cls => {
                expect(Object.keys(cls)).to.have.members(
                    ['className', 'initializer', 'targetErrors']
                )
            })
        })

        it('Should get the files in the list', () => {

            const classesIndex = [0, 1]

            const expected = getErrorClasses(['Test2Error', 'Test3Error'], fixturePath)

            expect(expected.map(el => el.className)).to.have.members(
                ['Test2Error', 'Test3Error']
            )
            classesIndex.forEach(idx => {
                expect(Object.keys(expected[idx])).to.have.members(
                    ['className', 'initializer', 'targetErrors']
                )
            })
        })
    })

    describe('registerErrorClass', () => {
        const opts = {
            internalList: [],
            path: path.join(__dirname, '__fixtures__')
        }

        it('should register all error classes', () => {
            // noinspection JSValidateTypes
            const expected = registerErrorClasses(opts)
            expect(Object.keys(expected)).to.have.members(
                ['TestError', 'Test1Error', 'Test2Error', 'Test3Error', 'normalize']
            )

        })
    })

    describe('identify', () => {

        const errorClasses = {
            Test1Error: {
                className: 'Test1Error',
                identify: {
                    standardTest1Error: err => !!err['_specificField1']
                }
            },
            Test2Error: {
                className: 'Test2Error',
                identify: {
                    standardTest2Error: err => !!err['_specificField2']
                }
            },
            Test3Error: {
                className: 'Test3Error',
                identify: {
                    standardTest3Error: err => !!err['_specificField3']
                }
            },
            Test4Error: {
                className: 'Test4Error',
                identify: {}
            }
        }

        it('Should identify the right error error', () => {
            const err = new Error(DUMMY_MESSAGE)
            err._specificField2 = '123456'

            const expected = identify(errorClasses, err)
            expect(expected[NPACK]).to.be.true
            expect(expected.errorClass).to.equal(errorClasses.Test2Error)
            expect(expected.targetError).to.equal('standardTest2Error')
        })

        it('Should return false in no such error is registered ', () => {
            const err = new Error(DUMMY_MESSAGE)
            err._specificField5 = '123456'

            expect(identify(errorClasses, err)).to.be.false
        })
    })

    describe('createError', () => {


        it('Should create a new error', () => {
            const err = new Error(DUMMY_MESSAGE)

            const nPack = {
                [NPACK]: true,
                errorClass: function(){
                    return new Error(DUMMY_MESSAGE)
                },
                targetError: 'standardTestError',
                key: TEST_ERROR
            }
            expect(createError(err, nPack)).to.have.instanceOf(Error)
            expect(createError(err, nPack).message).to.equal(DUMMY_MESSAGE)
        })
        it('Should return generic error', () => {
            const err = new Error(DUMMY_MESSAGE)
            expect(createError(err, false)).to.have.instanceOf(GenericError)
            expect(createError(err, false).message).to.equal(DUMMY_MESSAGE)
        })
    })

    describe('initNormalize', () => {

        it('Should return the error if it\'s an extended error', () => {

            const err = new GenericError(new Error(DUMMY_MESSAGE))
            const normalizeFn = initNormalize({})

            err._secretField = '123456'
            expect(normalizeFn(err)._secretField).to.equal('123456')
        })
    })
})