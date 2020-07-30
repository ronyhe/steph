const { evolve, map, prop, reduce, identity, append } = require('ramda')

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

const constant = value => input => success(value, input)

function transform(transformer, parser) {
    return input => {
        const res = parser(input)
        if (res.error) {
            return res
        } else {
            return evolve({ value: transformer }, res)
        }
    }
}

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
