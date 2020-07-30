const test = require('ava')
const {
    takeChar,
    UNEXPECTED_END_OF_INPUT,
    error,
    success,
    char
} = require('../../src/parser-combinators/stringParsers')

test('takeChar fails on empty input', t => {
    t.deepEqual(takeChar(''), {
        error: UNEXPECTED_END_OF_INPUT,
        value: null,
        rest: null
    })
})

test('takeChar removes first char and returns it', t => {
    t.deepEqual(takeChar('a'), {
        error: null,
        value: 'a',
        rest: ''
    })
})

test('takeChar advances lines', t => {
    t.deepEqual(takeChar('\n'), {
        error: null,
        value: '\n',
        rest: ''
    })
})

test('char only accepts the specified char', t => {
    t.deepEqual(char('a')('a'), success('a', ''))
})
