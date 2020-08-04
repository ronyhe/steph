# steph-js
Do you like Ramda style js?
Me too, in fact, I kinda hate js without it.
steph-js is a javascript flavor that enables such a style by default.

## Ramda as a standard library
Ramda is in scope by default
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
For example, you can pipe straight to node:
```shell script
steph file-to-compile -ri node | node -
``` 

## Implementation
steph performs a babel traversal which performs the following transformations:
- Wrap function expressions and arrow functions in a call to R.curry
- Convert unbounded identifiers that exist in Ramda into a `R.` member access

This has the following implications:
- All functions are curried by default
- Function declarations are currently not allowed (will throw an error)
- Every js file that babel can compile is valid steph. You can use your usual IDE
- JS isn't handled yet. Right now, you can freely call steph from js and vice-versa, 
but js functions will not be curried 

## Future steps
- Create a babel plugin
- Think of cool stuff to do with this

## Thanks
Thanks a lot to:
- babel - Great code, great libs and great error messages!
- yarn - I used yarn2 for this project - it was a great experience!
- Ramda - Thanks for showing me that js can be beautiful!
- @idok and @yuvalnissan - 
They're my bosses at wix.com, and they're great! Plus, wix.com is a great company to work for, IMO.
