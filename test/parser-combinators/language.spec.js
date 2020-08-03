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
    t.deepEqual(parse('a => b'), func(['a'], B))
    t.deepEqual(parse('a => b()'), func(['a'], call(B, [])))
    t.deepEqual(parse('a => b.c'), func(['a'], access(B, C)))
    t.deepEqual(parse('a => b => c'), func(['a'], func(['b'], C)))
})

test('parses functions with arg lists', t => {
    const { func } = Builders
    t.deepEqual(parse('(a) => b'), func(['a'], B))
    t.deepEqual(parse('(a, b) => c'), func(['a', 'b'], C))
    t.deepEqual(
        parse('(a, b) => (a, b) => c'),
        func(['a', 'b'], func(['a', 'b'], C))
    )
})

test('fails on non-sensical function arguments', t => {
    t.throws(() => parse('1 => a'))
    t.throws(() => parse('(a, b)'))
    t.throws(() => parse('a.b => c'))
})

test('parses objects', t => {
    const { obj } = Builders
    t.deepEqual(parse('{}'), obj({}))
    t.deepEqual(parse('{a: b}'), obj({ a: B }))
    t.deepEqual(parse('{a: b, c: a}'), obj({ a: B, c: A }))
})

test('parses lists', t => {
    const { list } = Builders
    t.deepEqual(parse('[]'), list([]))
    t.deepEqual(parse('[a]'), list([A]))
    t.deepEqual(parse('[a, b]'), list([A, B]))
})
