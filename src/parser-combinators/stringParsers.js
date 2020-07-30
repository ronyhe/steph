const { isEmpty, head, tail, ifElse, always } = require('ramda')

const UNEXPECTED_END_OF_INPUT = 'Unexpected end of input'

const error = message => ({
    error: message,
    value: null,
    rest: null
})

const success = (value, rest) => ({
    error: null,
    value,
    rest
})

const takeChar = ifElse(isEmpty, always(error(UNEXPECTED_END_OF_INPUT)), text =>
    success(head(text), tail(text))
)

module.exports = { takeChar, UNEXPECTED_END_OF_INPUT }
