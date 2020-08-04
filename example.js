/* eslint-disable */
const takeAAndAddOne = pipe(prop('a'), add(1))
console.log(takeAAndAddOne({a: 1})) // should log 2
