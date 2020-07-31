const {
    evolve,
    reduce,
    append,
    pipe,
    ifElse,
    prop,
    identity,
    always
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

const ifError = ifElse(isError)

const ifErrorId = ifError(identity)

const constant = value => input => success(value, input)

const transform = (transformer, parser) =>
    pipe(parser, ifErrorId(evolve({ value: transformer })))

const transformError = (transformer, parser) =>
    pipe(parser, ifError(evolve({ error: transformer }), identity))

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

const optional = parser => input => {
    const res = parser(input)
    if (isError(res)) {
        return success(null, input)
    } else {
        return res
    }
}

module.exports = {
    error,
    success,
    transform,
    transformError,
    seq,
    guard,
    asManyAsPossible,
    PREDICATE_FAILURE
}
