const test = require('ava')
const { map } = require('ramda')
const { parse, Builders } = require('../../src/parser-combinators/language')

const [A, B, C] = map(Builders.identifier, 'abc')

test('parses number', t => {
    t.deepEqual(parse('15.6'), Builders.number(15.6))
})

test('parses identifiers', t => {
    t.deepEqual(parse('someName'), Builders.identifier('someName'))
})

test('parses access', t => {
    const abAccess = Builders.access(A, B)

    t.deepEqual(parse('a.b'), abAccess)
    t.deepEqual(parse('a.b.c'), Builders.access(abAccess, C))
})

test('parses calls', t => {
    const { call, access } = Builders
    t.deepEqual(parse('a()'), call(A, []))
    t.deepEqual(parse('a(b,c)'), call(A, [B, C]))
    t.deepEqual(parse('a()()'), call(call(A, []), []))
    t.deepEqual(parse('a.b().c()'), call(access(call(access(A, B), []), C), []))
})
