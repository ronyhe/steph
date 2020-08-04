const test = require('ava')
const { compile, transformAst, createRamdaRequire } = require('../src/compiler')
const babelTypes = require('@babel/types')

test('Adds a ramda require', t => {
    t.deepEqual(compile(''), 'const R = require("ramda");')
})

test('Binds unbound variables to ramda, if they exist there', t => {
    t.deepEqual(compile('prop'), 'const R = require("ramda");\n\nR.prop;')
})
