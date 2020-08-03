const { prop, toString, pipe, join, map, toPairs } = require('ramda')
const { parse, Kinds } = require('./parser-combinators/language')

const TEMPLATE = `
    const R = require('ramda')
    R.forEach(k => {globalThis[k] = R[k]}, R.keys(R))
    console.log(INPUT)
`

const Emitters = {
    [Kinds.identifier]: prop('value'),
    [Kinds.number]: pipe(prop('value'), toString),
    [Kinds.access]: ({ target, member }) => `(${emit(target)}).${emit(member)}`,
    [Kinds.list]: ({ values }) => `[${join(',', map(emit, values))}]`,
    [Kinds.call]: ({ target, args }) =>
        `(${target})(${join(', ', map(emit, args))})`,
    [Kinds.func]: ({ args, body }) =>
        `R.curry((${join(',', args)}) => (${emit(body)}))`,
    [Kinds.obj]: ({ entries }) =>
        `{${join(
            ',',
            map(([name, value]) => `${name}: ${emit(value)}`, toPairs(entries))
        )}}`
}

function emit(ast) {
    return Emitters[ast.kind](ast)
}

function compile(text) {
    const ast = parse(text)
    const content = emit(ast)
    return TEMPLATE.replace('INPUT', content)
}

module.exports = { compile }
