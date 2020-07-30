const { isEmpty, head, tail, ifElse, always, equals } = require('ramda')
const { guard } = require('./core')

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

const char = c => guard(equals(c), takeChar)

module.exports = { char, takeChar, UNEXPECTED_END_OF_INPUT, error, success }
