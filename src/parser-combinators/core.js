const { evolve, map, prop, reduce, identity } = require('ramda')

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
            return {
                value: map(prop('value'), [resA, resB]),
                rest: resB.rest
            }
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
                return {
                    result: null,
                    error: `Does not match predicate: ${res.value}`
                }
            }
        }
    }
}

module.exports = {
    transform,
    seq,
    guard
}
