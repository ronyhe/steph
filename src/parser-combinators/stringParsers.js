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
    apply
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

const pFloat = text => {
    console.log(`pFloat ${text}`)
    return Number.parseFloat(text)
}

const number = (() => {
    const dotWithDigitsRaw = seq(char('.'), digits)
    const dotWithDigitsCombined = transform(apply(concat), dotWithDigitsRaw)
    const dotWithDigitsOrEmpty = withDefault('', dotWithDigitsCombined)
    const allChars = seq(digits, dotWithDigitsOrEmpty)
    const allCharsCombined = transform(apply(concat), allChars)
    return transform(pFloat, allCharsCombined)
})()

const whitespace = joinString(asManyAsPossible(regexChar(/\s/)))

module.exports = {
    stringError,
    string,
    char,
    takeChar,
    whitespace,
    number,
    UNEXPECTED_END_OF_INPUT
}
