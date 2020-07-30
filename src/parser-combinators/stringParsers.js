const { isEmpty, head, tail, ifElse, always, equals } = require('ramda')
const { guard, success, error } = require('./core')

const UNEXPECTED_END_OF_INPUT = 'Unexpected end of input'

const takeChar = ifElse(isEmpty, always(error(UNEXPECTED_END_OF_INPUT)), text =>
    success(head(text), tail(text))
)

const char = c => guard(equals(c), takeChar)

module.exports = { char, takeChar, UNEXPECTED_END_OF_INPUT }
