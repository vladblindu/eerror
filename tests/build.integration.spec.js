const path = require('path')
const fs = require('fs')
const {expect} = require('chai')
const {registerErrorClasses} = require('../index')
const {fileToErrorClass, ExtendedError} = require('../src/helpers')
const {DEFINITIONS_DIR} = require('../__constants')

describe('INTEGRATION TEST - main build', () => {

    const errorClasses = registerErrorClasses()

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
})