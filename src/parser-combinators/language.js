const { isEmpty } = require('ramda')
const { transform, options } = require('./core')
const StringParsers = require('./stringParsers')

const Kinds = {
    number: '<Kind:number>',
    identifier: '<Kind:identifier>'
}

const giveKind = kind => value => ({ value, kind })

const number = transform(giveKind(Kinds.number), StringParsers.number)

const identifier = transform(
    giveKind(Kinds.identifier),
    StringParsers.identifier
)

const expression = options(number, identifier)

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
