const test = require('ava')
const { compile } = require('../src/compiler')

test('Adds a ramda require', t => {
    t.deepEqual(compile(''), 'const R = require("ramda");')
})

test('Binds unbound variables to ramda, if they exist there', t => {
    t.deepEqual(compile('prop'), 'const R = require("ramda");\n\nR.prop;')
})

test('Does not bind unbound variables to ramda if they do not exist there', t => {
    t.deepEqual(compile('someName'), 'const R = require("ramda");\n\nsomeName;')
})

test('Does not bind variables that are already bound. Even if they exist in ramda', t => {
    t.deepEqual(
        compile('const prop = null;prop;'),
        'const R = require("ramda");\n\nconst prop = null;\nprop;'
    )
})

test('Curries arrow functions', t => {
    t.deepEqual(
        compile('() => {}'),
        'const R = require("ramda");\n\nR.curry(() => {});'
    )

    t.deepEqual(
        compile('(a) => {}'),
        'const R = require("ramda");\n\nR.curry(a => {});'
    )

    t.deepEqual(
        compile('a => {}'),
        'const R = require("ramda");\n\nR.curry(a => {});'
    )

    t.deepEqual(
        compile('(a, b) => {}'),
        'const R = require("ramda");\n\nR.curry((a, b) => {});'
    )

    t.deepEqual(
        compile('a => b => c'),
        'const R = require("ramda");\n\nR.curry(a => R.curry(b => c));'
    )
})
