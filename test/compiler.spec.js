const test = require('ava')
const { compile } = require('../src/compiler')

test('Adds a ramda require', t => {
    t.deepEqual(compile(''), 'const R = require("ramda");')
})

test('Binds unbound variables to ramda, if they exist there', t => {
    compileTest(t, 'prop', 'R.prop;')
})

test('Does not bind unbound variables to ramda if they do not exist there', t => {
    compileTest(t, 'someName', 'someName;')
})

test('Does not bind variables that are already bound. Even if they exist in ramda', t => {
    compileTest(t, 'const prop = null;prop;', 'const prop = null;\nprop;')
})

test('Curries arrow functions', t => {
    compileTest(t, '() => {}', 'R.curry(() => {});')
    compileTest(t, '(a) => {}', 'R.curry(a => {});')
    compileTest(t, 'a => {}', 'R.curry(a => {});')
    compileTest(t, '(a, b) => {}', 'R.curry((a, b) => {});')
    compileTest(t, 'a => b => c', 'R.curry(a => R.curry(b => c));')
})

test('Curries function expressions', t => {
    compileTest(
        t,
        'const a = function () {}',
        'const a = R.curry(function () {});'
    )
})

test('Throws an error on function declarations', t => {
    t.throws(() => compile('function fn() {}'))
})

function compileTest(t, sourceText, expectedOutput) {
    t.deepEqual(
        compile(sourceText),
        `const R = require("ramda");\n\n${expectedOutput}`
    )
}
