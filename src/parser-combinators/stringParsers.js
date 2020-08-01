const {
    isEmpty,
    head,
    tail,
    ifElse,
    always,
    equals,
    map,
    join,
    test,
    concat,
    reduce,
    complement
} = require('ramda')
const {
    guard,
    success,
    error,
    seq,
    transform,
    transformError,
    asManyAsPossible,
    withDefault
} = require('./core')

const stringError = expectedString => `Expected the string '${expectedString}'`

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

const regexChar = reg => guard(test(reg), takeChar)

const digit = regexChar(/\d/)

const digits = joinString(asManyAsPossible(digit))

const concatStrings = (...stringParsers) => {
    const concatStrings = reduce(concat, '')
    return transform(concatStrings, seq(...stringParsers))
}

const number = (() => {
    const dotWithDigitsRaw = concatStrings(char('.'), digits)
    const dotWithDigitsOrEmpty = withDefault('', dotWithDigitsRaw)
    const allChars = concatStrings(digits, dotWithDigitsOrEmpty)
    const notEmpty = guard(complement(isEmpty), allChars)
    return transform(Number.parseFloat, notEmpty)
})()

const identifier = (() => {
    const alpha = regexChar(/[a-zA-Z]/)
    const alphaNum = regexChar(/[a-zA-Z\d_]/)
    const restOfWord = joinString(asManyAsPossible(alphaNum))
    return concatStrings(alpha, restOfWord)
})()

const whitespace = joinString(asManyAsPossible(regexChar(/\s/)))

module.exports = {
    stringError,
    string,
    char,
    takeChar,
    whitespace,
    number,
    identifier,
    UNEXPECTED_END_OF_INPUT
}
