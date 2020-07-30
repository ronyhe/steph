const { isEmpty, head, tail } = require('ramda')
const { advance } = require('./position')

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
                    position: advance(value, position),
                    text: tail(text)
                }
            }
        }
    }
}

module.exports = { takeChar, UNEXPECTED_END_OF_INPUT }
