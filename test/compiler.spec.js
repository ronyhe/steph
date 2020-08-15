const test = require('ava')
const {
    compile,
    RamdaImport,
    FunctionDeclarationError
} = require('../src/compiler')

test('Binds unbound variables to ramda, if they exist there', t => {
    compileTest(t, 'prop', 'R.prop;')
})

test('Does not bind unbound variables to ramda if they do not exist there', t => {
    compileTest(t, 'someName', 'someName;')
})

test('Does not bind variables that are already bound. Even if they exist in ramda', t => {
    compileTest(t, 'const prop = null;prop;', 'const prop = null;\nprop;')
})

test('Does not bind object keys to ramda', t => {
    const text = 'const a = {\n  map: "just some text"\n};'
    compileTest(t, text, text)
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
    const error = t.throws(() => compile('function fn() {}'))
    t.assert(error.message.includes(FunctionDeclarationError))
})

test('Adds ramda require when ramdaImport is set to "node"', t => {
    t.deepEqual(compile('', RamdaImport.node), 'const R = require("ramda");')
})

test('Adds ramda import according to the ramdaImport parameter', t => {
    importTest(t, RamdaImport.es6, 'import * as R from "ramda";')
    importTest(t, RamdaImport.node, 'const R = require("ramda");')
    importTest(t, RamdaImport.none, '')
})

function compileTest(t, sourceText, expectedOutput) {
    t.deepEqual(compile(sourceText, RamdaImport.none), expectedOutput)
}

function importTest(t, importType, expectedOutput) {
    t.deepEqual(compile('', importType), expectedOutput)
}
