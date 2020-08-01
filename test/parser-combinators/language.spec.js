const test = require('ava')
const { parse, Kinds } = require('../../src/parser-combinators/language')

test('parses number', t => {
    t.deepEqual(parse('15.6'), {
        kind: Kinds.number,
        value: 15.6
    })
})

test('parses identifiers', t => {
    t.deepEqual(parse('someName'), {
        kind: Kinds.identifier,
        value: 'someName'
    })
})

test('parses access', t => {
    const access = (left, right) => ({ kind: Kinds.access, left, right })
    const name = value => ({ kind: Kinds.identifier, value })
    const abAccess = access(name('a'), name('b'))

    t.deepEqual(parse('a.b'), abAccess)
    t.deepEqual(parse('a.b.c'), access(abAccess, name('c')))
})
