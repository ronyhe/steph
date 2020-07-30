const test = require('ava')
const {
    takeChar,
    UNEXPECTED_END_OF_INPUT
} = require('../../src/parser-combinators/stringParsers')
const { INITIAL } = require('../../src/parser-combinators/position')

test('takeChar fails on empty input', t => {
    const input = {
        position: INITIAL,
        text: ''
    }
    t.deepEqual(takeChar(input), {
        error: UNEXPECTED_END_OF_INPUT,
        result: null
    })
})

test('takeChar removes first char and returns it', t => {
    const input = {
        position: INITIAL,
        text: 'a'
    }
    t.deepEqual(takeChar(input), {
        error: null,
        result: {
            value: 'a',
            rest: {
                text: '',
                position: { line: 1, col: 2 }
            }
        }
    })
})

test('takeChar advances lines', t => {
    const input = {
        position: INITIAL,
        text: '\n'
    }
    t.deepEqual(takeChar(input), {
        error: null,
        result: {
            value: '\n',
            rest: {
                text: '',
                position: { line: 2, col: 1 }
            }
        }
    })
})
