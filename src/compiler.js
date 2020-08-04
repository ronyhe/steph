const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babelTypes = require('@babel/types')
const generator = require('@babel/generator').default
const { codeFrameColumns } = require('@babel/code-frame')
const R = require('ramda')

function createCurriedArrowFunction(originalArrowFunction) {
    const t = babelTypes
    const ramdaCurry = createRamdaMember('curry')
    return t.callExpression(ramdaCurry, [originalArrowFunction])
}

function createRamdaMember(name) {
    const t = babelTypes
    return t.memberExpression(t.identifier('R'), t.identifier(name))
}

function createRamdaRequire() {
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

function transformAst(ast, throwFunctionDeclarationError) {
    const visitor = {
        FunctionDeclaration(path) {
            throwFunctionDeclarationError(path)
        },
        ArrowFunctionExpression: {
            exit(path) {
                path.replaceWith(createCurriedArrowFunction(path.node))
                path.skip()
            }
        },
        Identifier(path) {
            const name = path.node.name
            if (!path.scope.hasBinding(name) && R.includes(name, R.keys(R))) {
                path.replaceWith(createRamdaMember(name))
                path.skip()
            }
        },
        Program(path) {
            path.node.body.unshift(createRamdaRequire())
        }
    }
    traverse(ast, visitor)
}

function compile(sourceText) {
    const ast = parser.parse(sourceText, { sourceType: 'module' })
    const throwFunctionDeclarationError = path => {
        const errorText = codeFrameColumns(
            sourceText,
            path.node.loc,
            'steph does not allow function declarations (yet?). Use a arrow functions'
        )
        throw new Error(
            `steph does not allow function declarations (yet?). Use a arrow functions\n${errorText}`
        )
    }
    transformAst(ast, throwFunctionDeclarationError)
    return generator(ast).code
}

module.exports = {
    transformAst,
    createRamdaRequire
}

function main() {
    const code = `
        import a from './lame'
        const b = require('stupid')

        /*function someFunc(a, b) {
            prop('a')
        }*/

        const moreFunc = (a) => (b) => prop('a')
    `
    console.log(compile(code))
}

// main()
