const fs = require('fs')
const { compile } = require('compiler')

function main() {
    const cmdArgs = process.argv.slice(2)
    const filePath = cmdArgs[0]
    const input = fs.readFileSync(filePath)
    console.log(compile(input))
}

main()
