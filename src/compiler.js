const { transformSync } = require('@babel/core')
const R = require('ramda')
const { includes, keys, pipe, toLower, defaultTo, flip, prop } = R

const FunctionDeclarationError =
    'steph does not allow function declarations (yet?). Use a arrow functions instead'

const RamdaImport = {
    node: 'node',
    es6: 'es6',
    none: 'none'
}

const getFrom = flip(prop)

const ramdaImportFromString = pipe(
    toLower,
    getFrom(RamdaImport),
    defaultTo(RamdaImport.none)
)

const createSyntax = t => {
    const ramdaMember = name =>
        t.memberExpression(t.identifier('R'), t.identifier(name))
    return {
        ramdaMember,
        curriedFunction: originalFunction =>
            t.callExpression(ramdaMember('curry'), [originalFunction]),
        ramdaEs6Import: () =>
            t.importDeclaration(
                [t.importNamespaceSpecifier(t.identifier('R'))],
                t.stringLiteral('ramda')
            ),
        ramdaRequireImport: () =>
            t.variableDeclaration('const', [
                t.variableDeclarator(
                    t.identifier('R'),
                    t.callExpression(t.identifier('require'), [
                        t.stringLiteral('ramda')
                    ])
                )
            ])
    }
}

const createCurryVisitor = syntax => ({
    exit: path => {
        path.replaceWith(syntax.curriedFunction(path.node))
        path.skip()
    }
})

const plugin = ({ types }) => {
    const syntax = createSyntax(types)
    const curryVisitor = createCurryVisitor(syntax)
    return {
        visitor: {
            FunctionExpression: curryVisitor,
            ArrowFunctionExpression: curryVisitor,
            Identifier(path) {
                const name = path.node.name
                if (!path.scope.hasBinding(name) && includes(name, keys(R))) {
                    path.replaceWith(syntax.ramdaMember(name))
                    path.skip()
                }
            },
            Program: {
                exit(path, state) {
                    const importType = ramdaImportFromString(
                        state.opts.ramdaImport
                    )
                    if (importType === RamdaImport.node) {
                        path.node.body.unshift(syntax.ramdaRequireImport())
                    }
                    if (importType === RamdaImport.es6) {
                        path.node.body.unshift(syntax.ramdaEs6Import())
                    }
                }
            },
            FunctionDeclaration(path) {
                throw path.buildCodeFrameError(FunctionDeclarationError)
            }
        }
    }
}

function compile(sourceText, ramdaImport) {
    return transformSync(sourceText, { plugins: [[plugin, { ramdaImport }]] })
        .code
}

module.exports = {
    compile,
    RamdaImport,
    FunctionDeclarationError,
    plugin
}
