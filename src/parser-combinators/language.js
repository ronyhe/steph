const {
    isEmpty,
    last,
    reduce,
    pair,
    map,
    compose,
    prop,
    remove,
    fromPairs
} = require('ramda')
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
    func: '<Kinds:func>',
    obj: '<Kinds:obj>'
}

const Builders = {
    identifier: name => ({ value: name, kind: Kinds.identifier }),
    number: value => ({ value, kind: Kinds.number }),
    access: (target, member) => ({ target, member, kind: Kinds.access }),
    call: (target, args) => ({ target, args, kind: Kinds.call }),
    func: (args, body) => ({ body, args, kind: Kinds.func }),
    obj: entries => ({ entries, kind: Kinds.obj })
}

const [dot, comma, leftParen, rightParen, leftCurly, rightCurly, colon] = map(
    compose(StringParsers.withWhitespace, StringParsers.char),
    '.,(){}:'
)

const arrow = StringParsers.withWhitespace(StringParsers.string('=>'))

const giveKindToValue = kind => value => ({ value, kind })

const giveKindToParser = (kind, parser) =>
    transform(giveKindToValue(kind), parser)

const number = giveKindToParser(Kinds.number, StringParsers.number)

const identifier = giveKindToParser(Kinds.identifier, StringParsers.identifier)

const terminals = StringParsers.withWhitespace(
    options(obj, func, number, identifier)
)

const accessContinuation = (() => {
    const parser = transform(last, seq(dot, identifier))
    return transform(pair(Builders.access), parser)
})()

const parens = between(leftParen, rightParen)

const curlies = between(leftCurly, rightCurly)

const commaList = sepRep(comma)

const continuations = asManyAsPossible(
    options(accessContinuation, callContinuation)
)

function callContinuation(input) {
    const withContinuation = transform(
        pair(Builders.call),
        parensExpressionList
    )
    return withContinuation(input)
}

function parensExpressionList(input) {
    return parens(commaList(expression))(input)
}

function obj(input) {
    const iden = StringParsers.withWhitespace(identifier)
    const makeEntry = ([name, , ex]) => [name.value, ex]
    const entry = transform(makeEntry, seq(iden, colon, expression))
    const entries = transform(fromPairs, commaList(entry))
    const parser = transform(Builders.obj, curlies(entries))
    return parser(input)
}

function func(input) {
    const iden = StringParsers.withWhitespace(identifier)
    const identifierList = parens(commaList(iden))
    const singleArg = transform(Array, identifier)
    const args = options(singleArg, identifierList)
    const makeFunction = ([params, , body]) => Builders.func(params, body)
    const parser = transform(makeFunction, seq(args, arrow, expression))
    return parser(input)
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
