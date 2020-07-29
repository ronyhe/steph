const { Right, Left } = require('sanctuary-either')
const { isEmpty } = require('ramda')

const UNEXPECTED_END_OF_INPUT = 'Unexpected end of input'

function takeOne(input) {
    if (isEmpty(input.value)) {
        return Right({
            error: UNEXPECTED_END_OF_INPUT,
            position: input.position
        })
    } else {
        return Left({
            value: input.value,
            rest: input.rest()
        })
    }
}

module.exports = { UNEXPECTED_END_OF_INPUT, takeOne }
