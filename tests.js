'use strict'

console.log("tests.js");

console.assert(
    counter(0, { type: "INCREMENT"}) === 1
)

console.assert(
    counter(1, { type: "INCREMENT"}) === 2
)

console.assert(
    counter(0, { type: "DECREMENT"}) === -1
)

console.assert(
    counter(1, { type: "DECREMENT"}) === 0
)

console.assert(
    counter(1, { type: "SOMETHING"}) === 1
)

console.assert(
    counter(7, { type: "ANYTHING"}) === 7
)

console.assert(
    counter(1) === 1
)

console.assert(
    counter(undefined) === 0
)