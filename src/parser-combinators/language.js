const { isEmpty } = require('ramda')
const { transform } = require('./core')
const StringParsers = require('./stringParsers')

const Kinds = {
    number: '<Kind:number>'
}

const giveKind = kind => value => ({ value, kind })

const number = transform(giveKind(Kinds.number), StringParsers.number)

function parse(text) {
    const result = number(text)
    if (result.error) {
        throw new Error(`Parse error: ${result.error}`)
    }
    if (!isEmpty(result.rest)) {
        throw new Error(
            `Not all input was parsed. Remaining input: ${result.rest}`
        )
    }
    return result.value
}

module.exports = { parse, Kinds }
