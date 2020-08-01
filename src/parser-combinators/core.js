const {
    evolve,
    reduce,
    append,
    pipe,
    ifElse,
    prop,
    identity,
    always,
    isNil,
    compose,
    nth,
    last,
    prepend
} = require('ramda')

const PREDICATE_FAILURE = 'Predicate failure'

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

const isError = prop('error')

const ifErrorElse = ifElse(isError)

const ifErrorId = ifErrorElse(identity)

const constant = value => input => success(value, input)

const constantError = compose(always, error)

const transform = (transformer, parser) =>
    pipe(parser, ifErrorId(evolve({ value: transformer })))

const transformError = (transformer, parser) =>
    pipe(parser, ifErrorElse(evolve({ error: transformer }), identity))

function seq(...parsers) {
    return reduce(
        (acc, p) => input => {
            const resA = acc(input)
            if (resA.error) {
                return resA
            }
            const resB = p(resA.rest)
            if (resB.error) {
                return resB
            }
            return {
                error: null,
                value: append(resB.value, resA.value),
                rest: resB.rest
            }
        },
        constant([]),
        parsers
    )
}

function asManyAsPossible(parser) {
    return input => {
        let result = {
            value: [],
            error: null,
            rest: input
        }
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const res = parser(result.rest)
            if (isError(res)) {
                return result
            } else {
                result = evolve(
                    {
                        value: append(res.value),
                        rest: always(res.rest)
                    },
                    result
                )
            }
        }
    }
}

function guard(pred, parser) {
    return input => {
        const res = parser(input)
        if (res.error) {
            return res
        } else {
            if (pred(res.value)) {
                return res
            } else {
                return error(PREDICATE_FAILURE)
            }
        }
    }
}

const twoOptions = (a, b) => input => {
    const res = a(input)
    return isError(res) ? b(input) : res
}

const optional = parser => twoOptions(parser, constant(null))

const options = (...parsers) =>
    reduce(
        twoOptions,
        constantError('Cannot parse any of the alternatives'),
        parsers
    )

const withDefault = (value, parser) =>
    transform(ifElse(isNil, always(value), identity), optional(parser))

const between = (open, close) => content =>
    transform(nth(1), seq(open, content, close))

const prep = ([a, as]) => prepend(a, as)

const sepRep = sep => rep => {
    const restParts = transform(last, seq(sep, rep))
    const rest = asManyAsPossible(restParts)
    const parser = transform(prep, seq(rep, rest))
    return withDefault([], parser)
}

module.exports = {
    error,
    success,
    transform,
    transformError,
    seq,
    guard,
    asManyAsPossible,
    optional,
    options,
    withDefault,
    between,
    sepRep,
    PREDICATE_FAILURE
}
