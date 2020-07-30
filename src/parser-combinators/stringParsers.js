const { isEmpty, head, tail } = require('ramda')

const UNEXPECTED_END_OF_INPUT = 'Unexpected end of input'

function takeChar(text) {
    if (isEmpty(text)) {
        return {
            value: null,
            rest: null,
            error: UNEXPECTED_END_OF_INPUT
        }
    } else {
        return {
            error: null,
            rest: tail(text),
            value: head(text)
        }
    }
}

module.exports = { takeChar, UNEXPECTED_END_OF_INPUT }
