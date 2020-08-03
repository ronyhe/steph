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

test('parses spaces', t => {
    const { call, access } = Builders
    t.deepEqual(parse('a(b, c)'), call(A, [B, C]))
    t.deepEqual(parse('a\n    .b'), access(A, B))
})

test('parses simple functions', t => {
    const { func, call, access } = Builders
    t.deepEqual(parse('a => b'), func([A], B))
    t.deepEqual(parse('a => b()'), func([A], call(B, [])))
    t.deepEqual(parse('a => b.c'), func([A], access(B, C)))
    t.deepEqual(parse('a => b => c'), func([A], func([B], C)))
})

test.skip('parses functions with arg lists', t => {
    const { func } = Builders
    t.deepEqual(parse('(a) => b'), func([A], B))
    t.deepEqual(parse('(a, b) => c'), func([A, B], C))
})

test.skip('fails on non-sensical function arguments', t => {
    t.truthy(parse('1 => a').error)
    t.truthy(parse('(a, b)').error)
    t.truthy(parse('a.b => c').error)
})
