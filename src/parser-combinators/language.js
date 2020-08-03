const { isEmpty, last, reduce, pair, map, compose } = require('ramda')
const {
    transform,
    options,
    seq,
    asManyAsPossible,
    sepRep,
    between
} = require('./core')
const StringParsers = require('./stringParsers')

const Kinds = {
    number: '<Kind:number>',
    identifier: '<Kind:identifier>',
    access: '<Kinds:access>',
    call: '<Kinds:call>',
    func: '<Kinds:func>'
}

const Builders = {
    identifier: name => ({ value: name, kind: Kinds.identifier }),
    number: value => ({ value, kind: Kinds.number }),
    access: (target, member) => ({ target, member, kind: Kinds.access }),
    call: (target, args) => ({ target, args, kind: Kinds.call }),
    func: (args, body) => ({ body, args, kind: Kinds.func })
}

const [dot, comma, leftParen, rightParen] = map(
    compose(StringParsers.withWhitespace, StringParsers.char),
    '.,()'
)

const arrow = StringParsers.withWhitespace(StringParsers.string('=>'))

const giveKindToValue = kind => value => ({ value, kind })

const giveKindToParser = (kind, parser) =>
    transform(giveKindToValue(kind), parser)

const number = giveKindToParser(Kinds.number, StringParsers.number)

const identifier = giveKindToParser(Kinds.identifier, StringParsers.identifier)

const terminals = StringParsers.withWhitespace(options(number, identifier))

const accessContinuation = (() => {
    const parser = transform(last, seq(dot, identifier))
    return transform(pair(Builders.access), parser)
})()

const parens = between(leftParen, rightParen)

const commaList = sepRep(comma)

const continuations = asManyAsPossible(
    options(accessContinuation, callContinuation, arrowContinuation)
)

function callContinuation(input) {
    const parser = parens(commaList(expression))
    const withContinuation = transform(pair(Builders.call), parser)
    return withContinuation(input)
}

function arrowContinuation(input) {
    const parser = transform(last, seq(arrow, expression))
    const combineSingleArgument = (arg, body) => Builders.func([arg], body)
    const withContinuation = transform(pair(combineSingleArgument), parser)
    return withContinuation(input)
}

function expression(input) {
    const parser = seq(terminals, continuations)
    const reducer = (acc, [f, right]) => f(acc, right)
    const combine = ([base, conts]) => reduce(reducer, base, conts)
    return transform(combine, parser)(input)
}

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

module.exports = { parse, Kinds, Builders }
