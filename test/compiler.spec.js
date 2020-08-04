const test = require('ava')
const { transformAst, createRamdaRequire } = require('../src/compiler')
const babelTypes = require('@babel/types')

test('Adds a ramda require', t => {
    const ast = babelTypes.file(babelTypes.program([], [], 'module'))
    transformAst(ast, () => {})
    t.deepEqual(
        ast,
        babelTypes.file(
            babelTypes.program([createRamdaRequire()], [], 'module')
        )
    )
})
