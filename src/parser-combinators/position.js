const INITIAL = { line: 1, col: 1 }

function advance(char, position) {
    if (char === '\n') {
        return {
            line: position.line + 1,
            col: 1
        }
    } else {
        return {
            line: position.line,
            col: position.col + 1
        }
    }
}

module.exports = {
    INITIAL,
    advance
}
