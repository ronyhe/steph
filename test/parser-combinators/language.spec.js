const test = require('ava')
const { parse, Kinds } = require('../../src/parser-combinators/language')

test('parses number', t => {
    t.deepEqual(parse('15.6'), {
        kind: Kinds.number,
        value: 15.6
    })
})
