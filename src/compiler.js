const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babelTypes = require('@babel/types')
const generator = require('@babel/generator').default
const { codeFrameColumns } = require('@babel/code-frame')
const R = require('ramda')
const { includes, keys, defaultTo } = R

const RamdaImport = {
    node: 'node',
    es6: 'es6',
    none: 'none'
}

function createCurriedFunction(originalFunction) {
    const t = babelTypes
    const ramdaCurry = createRamdaMember('curry')
    return t.callExpression(ramdaCurry, [originalFunction])
}

function createRamdaMember(name) {
    const t = babelTypes
    return t.memberExpression(t.identifier('R'), t.identifier(name))
}

function ramdaRequireImport() {
    const t = babelTypes
    return t.variableDeclaration('const', [
        t.variableDeclarator(
            t.identifier('R'),
            t.callExpression(t.identifier('require'), [
                t.stringLiteral('ramda')
            ])
        )
    ])
}

function ramdaEs6Import() {
    const t = babelTypes
    return t.importDeclaration(
        [t.importNamespaceSpecifier(t.identifier('R'))],
        t.stringLiteral('ramda')
    )
}

function ramdaImportAst(ramdaImportType) {
    if (ramdaImportType === RamdaImport.none) {
        return null
    }
    if (ramdaImportType === RamdaImport.node) {
        return ramdaRequireImport()
    }
    if (ramdaImportType === RamdaImport.es6) {
        return ramdaEs6Import()
    }
    throw new Error(`Unknown ramda import type: ${ramdaImportType}`)
}

function compile(sourceText, ramdaImportType) {
    const ast = parser.parse(sourceText, { sourceType: 'module' })
    traverse(ast, {
        FunctionExpression: {
            exit(path) {
                path.replaceWith(createCurriedFunction(path.node))
                path.skip()
            }
        },
        ArrowFunctionExpression: {
            exit(path) {
                path.replaceWith(createCurriedFunction(path.node))
                path.skip()
            }
        },
        Identifier(path) {
            const name = path.node.name
            if (!path.scope.hasBinding(name) && includes(name, keys(R))) {
                path.replaceWith(createRamdaMember(name))
                path.skip()
            }
        },
        Program: {
            exit(path) {
                path.node.body.unshift(
                    ramdaImportAst(defaultTo(RamdaImport.none, ramdaImportType))
                )
            }
        },
        FunctionDeclaration(path) {
            const errorText = codeFrameColumns(
                sourceText,
                path.node.loc,
                'steph does not allow function declarations (yet?). Use a arrow functions'
            )
            throw new Error(
                `steph does not allow function declarations (yet?). Use a arrow functions\n${errorText}`
            )
        }
    })
    return generator(ast).code
}

module.exports = {
    compile,
    RamdaImport
}
