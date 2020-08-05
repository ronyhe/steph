# Steph - Ramda Style JS
Do you like Ramda style js?
Me too, in fact, I kinda hate js without it.
Steph is a (spicy) javascript flavor that enables such a style.

## Ramda as a standard library
Ramda is always in scope
```javascript
const takeTheGoodOneAndAddFive = pipe(prop('good'), add(5))
console.log(takeTheGoodOneAndAddFive({good: 4})) // => 9
```

## Curried by default (Just like Steph)
```javascript
const myEquals = (a, b) => a === b
const myEquals5 = myEquals(5)
console.log(myEquals5(5)) // => true
console.log(myEquals5(666)) // => false
```

## Command line
The following command will compile and print the js version of `file-to-compile` 
```shell script
steph file-to-compile
```
The compiler will add a `require` or `import` for Ramda if you use the `--ramdaImport` or `-ri` flag,
it can be set to `node` or to `es6`.
For example, you can pipe straight to node like so:
```shell script
steph file-to-compile -ri node | node -
``` 

## Implementation
steph performs a babel traversal which performs the following transformations:
- Wrap function expressions and arrow functions in a call to R.curry
- Convert unbound identifiers that exist in Ramda into a `R.` member access

This has the following implications:
- Function are curried by default
- Ramda acts as a sort of standard library
- Most js files that babel can compile are valid Steph. You can use your usual IDE.
- JS interop isn't handled yet. Right now, you can freely call Steph from js and vice-versa, 
but js functions will not be curried.
- Classic-style function declarations are not allowed.
Arrow functions are fine (`() => {}`) and so are function expressions `function () {}`. However, this will throw an error at compile time: `function name() {}`

## Future steps
- Create a babel plugin
- Better cli
- Consider adding literals for basic Ramda functions such as `prop`, `path` and `index`.
- Think of cool stuff to do with this

## Acknowledgement
Thanks a lot to:
- [babel](https://babeljs.io/) - Great code, great libs and great error messages!
- [Ramda](https://ramdajs.com/) - Thanks for showing me that js can be beautiful!
- [@idok](https://github.com/idok) and [@yuvalnissan](https://github.com/yuvalnissan) - 
They're my bosses at wix.com and they're great! Plus, [wix.com](https://www.wix.com/jobs/home) is a great company to work for, IMO.
- This project is developed using, among others:
    - [node](https://nodejs.org/en/)
    - [yarn](https://yarnpkg.com/)
    - [ava](https://github.com/avajs/ava)
    - [husky](https://github.com/typicode/husky)
    - [eslint](https://eslint.org/)
    - [prettier](https://prettier.io/)
