const {
    evolve,
    reduce,
    append,
    pipe,
    ifElse,
    prop,
    identity
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

const ifError = ifElse(prop('error'))

const ifNotError = ifError(identity)

const constant = value => input => success(value, input)

const transform = (transformer, parser) =>
    pipe(parser, ifNotError(evolve({ value: transformer })))

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

module.exports = {
    error,
    success,
    transform,
    seq,
    guard,
    PREDICATE_FAILURE
}
