const { isEmpty, last, reduce } = require('ramda')
const { transform, options, seq, asManyAsPossible } = require('./core')
const StringParsers = require('./stringParsers')

const Kinds = {
    number: '<Kind:number>',
    identifier: '<Kind:identifier>',
    access: '<Kinds:access>'
}

const giveKindToValue = kind => value => ({ value, kind })

const giveKindToParser = (kind, parser) =>
    transform(giveKindToValue(kind), parser)

const number = giveKindToParser(Kinds.number, StringParsers.number)

const identifier = giveKindToParser(Kinds.identifier, StringParsers.identifier)

const terminals = options(number, identifier)

const dot = StringParsers.char('.')

const accessNames = (() => {
    const access = transform(last, seq(dot, identifier))
    return asManyAsPossible(access)
})()

const expression = (() => {
    const parser = seq(terminals, accessNames)
    const makeAccess = (left, right) => ({ kind: Kinds.access, left, right })
    const combine = ([base, names]) => reduce(makeAccess, base, names)
    return transform(combine, parser)
})()

function parse(text) {
    const result = expression(text)
    if (result.error) {
        throw new Error(`Parse error: ${result.error}`)
    }
    if (!isEmpty(result.rest)) {
        throw new Error(
            `Not all input was parsed. Remaining input: '${result.rest}'`
        )
    }
    return result.value
}

module.exports = { parse, Kinds }
