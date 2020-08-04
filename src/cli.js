const {
    drop,
    includes,
    all,
    isEmpty,
    join,
    head,
    findIndex,
    flip,
    cond,
    equals,
    always,
    T
} = require('ramda')
const fs = require('fs')
const { RamdaImport, compile } = require('./compiler')

const TriggerHelp = '-h --help -v --version'.split(' ')
const flipIncludes = flip(includes)

function main() {
    const args = drop(2, process.argv)
    if (isEmpty(args)) {
        help()
        return
    }
    if (all(flipIncludes(TriggerHelp), args)) {
        help()
        return
    }
    if (args.length < 1) {
        help()
        return
    }
    const file = head(args)
    const importStyle = ramdaImport(args)

    const sourceText = fs.readFileSync(file)
    console.log(compile(sourceText, importStyle))
}

function ramdaImport(args) {
    const indicatorIndex = findIndex(
        flipIncludes(['-ri', '--ramdaImport']),
        args
    )
    if (indicatorIndex < 1) {
        return RamdaImport.none
    }
    const value = args[indicatorIndex + 1]
    return cond([
        [equals('es6'), always(RamdaImport.es6)],
        [equals('node'), always(RamdaImport.node)],
        [T, always(RamdaImport.none)]
    ])(value)
}

function help() {
    const text = join('\n', [
        'The steph compiler v0.0.1',
        '',
        'Usage: steph <file> [option]',
        'options:',
        '   -v --version Trigger this help message',
        '   -h --help Trigger this help message',
        '   -ri --ramdaImport How and if to add a ramda import to the output. "node"|"es6"|"none"(default)'
    ])
    console.log(text)
}

main()
