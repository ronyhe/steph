const test = require('ava')
const { parse, Builders } = require('../../src/parser-combinators/language')

test('parses number', t => {
    t.deepEqual(parse('15.6'), Builders.number(15.6))
})

test('parses identifiers', t => {
    t.deepEqual(parse('someName'), Builders.identifier('someName'))
})

test('parses access', t => {
    const abAccess = Builders.access(
        Builders.identifier('a'),
        Builders.identifier('b')
    )

    t.deepEqual(parse('a.b'), abAccess)
    t.deepEqual(
        parse('a.b.c'),
        Builders.access(abAccess, Builders.identifier('c'))
    )
})
