'use strict'

console.log("main.js");

const counter = (state = 0, action) => {

    if (action === undefined) {
        return state
    }

    switch (action.type) {
        case "INCREMENT": return state = state + 1
        case "DECREMENT": return state = state - 1
    }

    return state
}

const {createStore} = Redux

const store = createStore(counter)

var $counter = document.querySelector("[data-js='counter']")
var $increment = document.querySelector("[data-js='increment']")
var $decrement = document.querySelector("[data-js='decrement']")

const increment = () => {
    store.dispatch({type: "INCREMENT"})
}

const decrement = () => {
    store.dispatch({type: "DECREMENT"})
}


$increment.addEventListener("click" ,increment, false)
$decrement.addEventListener("click" ,decrement, false)

store.subscribe(() => {
    $counter.textContent = store.getState()
})



