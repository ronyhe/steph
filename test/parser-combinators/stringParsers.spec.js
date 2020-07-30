const test = require('ava')
const {
    takeChar,
    UNEXPECTED_END_OF_INPUT,
    char
} = require('../../src/parser-combinators/stringParsers')
const {
    PREDICATE_FAILURE,
    success,
    error
} = require('../../src/parser-combinators/core')

test('takeChar fails on empty input', t => {
    t.deepEqual(takeChar(''), error(UNEXPECTED_END_OF_INPUT))
})

test('takeChar removes first char and returns it', t => {
    t.deepEqual(takeChar('a'), success('a', ''))
})

test('takeChar advances lines', t => {
    t.deepEqual(takeChar('\n'), success('\n', ''))
})

test('char only accepts the specified char', t => {
    t.deepEqual(char('a')('a'), success('a', ''))
    t.deepEqual(char('a')('b'), error(PREDICATE_FAILURE))
})
