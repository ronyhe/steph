const {
    isEmpty,
    head,
    tail,
    ifElse,
    always,
    equals,
    map,
    join,
    test
} = require('ramda')
const {
    guard,
    success,
    error,
    seq,
    transform,
    transformError,
    asManyAsPossible
} = require('./core')

const UNEXPECTED_END_OF_INPUT = 'Unexpected end of input'

const takeChar = ifElse(isEmpty, always(error(UNEXPECTED_END_OF_INPUT)), text =>
    success(head(text), tail(text))
)

const char = c => guard(equals(c), takeChar)

const joinString = charsParser => transform(join(''), charsParser)

const string = str => {
    const letters = map(char, str)
    const parser = joinString(seq(...letters))
    return transformError(always(stringError(str)), parser)
}

const whitespace = joinString(asManyAsPossible(guard(test(/\s/), takeChar)))

const stringError = expectedString => `Expected the string '${expectedString}'`

module.exports = {
    stringError,
    string,
    char,
    takeChar,
    whitespace,
    UNEXPECTED_END_OF_INPUT
}
