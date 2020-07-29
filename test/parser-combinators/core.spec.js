const test = require('ava')
const { Right } = require('sanctuary-either')
const core = require('../../src/parser-combinators/core')
const input = require('../../src/parser-combinators/input')

test('takeOne', t => {
    t.deepEqual(
        core.takeOne(input.EMPTY),
        Right({
            error: core.UNEXPECTED_END_OF_INPUT,
            position: input.EMPTY.position
        })
    )
})
