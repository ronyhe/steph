const { isEmpty, head, tail } = require('ramda')

const UNEXPECTED_END_OF_INPUT = 'Unexpected end of input'

function takeChar({ position, text }) {
    if (isEmpty(text)) {
        return {
            result: null,
            error: {
                message: UNEXPECTED_END_OF_INPUT,
                position
            }
        }
    } else {
        const value = head(text)
        return {
            error: null,
            result: {
                value,
                rest: {
                    position: advancePosition(value, position),
                    text: tail(text)
                }
            }
        }
    }
}

function advancePosition(char, position) {
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

module.exports = { takeChar, UNEXPECTED_END_OF_INPUT }
