const { Nothing } = require('sanctuary-maybe')

const EMPTY = {
    value: Nothing,
    position: { line: 0, col: 0 },
    rest: () => EMPTY
}

module.exports = { EMPTY }
