const { transformSync } = require('@babel/core')
const R = require('ramda')
const { includes, keys, cond, always, equals } = R

const FunctionDeclarationError =
    'steph does not allow function declarations (yet?). Use a arrow functions instead'

const RamdaImport = {
    node: '<RamdaImport:node>',
    es6: '<RamdaImport:es6>',
    none: '<RamdaImport:none>'
}

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

const ramdaImportAst = syntax =>
    cond([
        [equals(RamdaImport.none), always(null)],
        [equals(RamdaImport.node), syntax.ramdaRequireImport],
        [equals(RamdaImport.es6), syntax.ramdaEs6Import]
    ])

const plugin = ({ types }) => {
    const syntax = createSyntax(types)
    return {
        visitor: {
            FunctionExpression: {
                exit: path => {
                    path.replaceWith(syntax.curriedFunction(path.node))
                    path.skip()
                }
            },
            ArrowFunctionExpression: {
                exit: path => {
                    path.replaceWith(syntax.curriedFunction(path.node))
                    path.skip()
                }
            },
            Identifier(path) {
                const name = path.node.name
                if (!path.scope.hasBinding(name) && includes(name, keys(R))) {
                    path.replaceWith(syntax.ramdaMember(name))
                    path.skip()
                }
            },
            Program: {
                exit(path, state) {
                    const importAst = ramdaImportAst(syntax)(
                        state.opts.ramdaImport
                    )
                    path.node.body.unshift(importAst)
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
    FunctionDeclarationError
}
