const test = require('ava')
const {
    takeChar,
    UNEXPECTED_END_OF_INPUT
} = require('../../src/parser-combinators/stringParsers')

test('takeChar fails on empty input', t => {
    const position = { line: 1, col: 1 }
    const input = {
        position,
        text: ''
    }
    t.deepEqual(takeChar(input), {
        error: {
            position,
            message: UNEXPECTED_END_OF_INPUT
        },
        result: null
    })
})

test('takeChar removes first char and returns it', t => {
    const position = { line: 1, col: 1 }
    const input = {
        position,
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
    const position = { line: 1, col: 1 }
    const input = {
        position,
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
