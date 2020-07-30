const { evolve, map, prop, reduce, identity } = require('ramda')

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

function transform(transformer, parser) {
    return input => {
        const res = parser(input)
        if (res.error) {
            return res
        } else {
            return evolve({ value: transformer })
        }
    }
}

function seq2(a, b) {
    return input => {
        const resA = a(input)
        if (resA.error) {
            return resA
        } else {
            const resB = b(resA.rest)
            return success(map(prop('value'), [resA, resB]), resB.rest)
        }
    }
}

function seq(...parsers) {
    return reduce(seq2, identity, parsers)
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
