/*
  ## TODO

  - Botão de remover todos do lado do botão de adcionar um
  - Integrar com o Google Fire Base
  - Estilizar
*/

(function () {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  //State
  const initalState = [
    {
      id: Math.floor((1 + Math.random()) * 100),
      name: "Counter",
      value: 0,
      amount: 1,
    },
  ];
  const store = Redux.createStore(counterReducer);

  render();
  store.subscribe(render);

  $("#add-counter").addEventListener("click", function () {
    store.dispatch(addCounter());
  });

  $("#remove-all-counters").addEventListener("click", function () {
    showModalConfirm({
      title: `Removing all counters...`,
      id: "",
      callback: () => store.dispatch(removeAllCounters()),
    });
  });

  //reducers
  function counterReducer(state = initalState, action) {
    const { type } = action;

    if (type === "INCREMENT") {
      return incrementNewState(state, action);
    } else if (type === "DECREMENT") {
      return decrementNewState(state, action);
    } else if (type === "UPDATE_AMOUNT") {
      return amountNewState(state, action);
    } else if (type === "UPDATE_NAME") {
      return nameNewState(state, action);
    } else if (type === "RESET") {
      return resetNewState(state, action);
    } else if (type === "ADD_COUNTER") {
      return addCounterNewState(state);
    } else if (type === "REMOVE_COUNTER") {
      return removeCounterNewState(state, action);
    } else if (type === "REMOVE_ALL_COUNTERS") {
      return [];
    } else {
      return state;
    }
  }

  function incrementNewState(state, action) {
    let newState = [...state];
    let index = newState.findIndex((item) => item.id === action.payload);
    newState[index].value += newState[index].amount;
    return newState;
  }

  function decrementNewState(state, action) {
    let newState = [...state];
    let index = newState.findIndex((item) => item.id === action.payload);
    newState[index].value -= newState[index].amount;
    return newState;
  }

  function amountNewState(state, action) {
    if (action.payload.amount) {
      let newState = [...state];
      let index = newState.findIndex((item) => item.id === action.payload.id);
      newState[index].amount = action.payload.amount;
      return newState;
    } else {
      return {
        ...state,
        amount: 0,
      };
    }
  }

  function nameNewState(state, action) {
    let newState = [...state];
    let index = newState.findIndex((item) => item.id === action.payload.id);
    newState[index].name = action.payload.name;
    return newState;
  }

  function resetNewState(state, action) {
    let newState = [...state];
    let index = newState.findIndex((item) => item.id === action.payload);
    newState[index].value = 0;
    newState[index].amount = 1;
    newState[index].name = "Counter";
    return newState;
  }

  function addCounterNewState(state) {
    return [
      ...state,
      {
        id: Math.floor((1 + Math.random()) * 100),
        value: 0,
        amount: 1,
        name: "Counter",
      },
    ];
  }

  function removeCounterNewState(state, action) {
    return [...state].filter((item) => item.id !== action.payload);
  }

  //Actions
  function incrementCounter(id) {
    return {
      type: "INCREMENT",
      payload: id,
    };
  }

  function decrementCounter(id) {
    return {
      type: "DECREMENT",
      payload: id,
    };
  }

  function updateAmountCount(id, amount) {
    return {
      type: "UPDATE_AMOUNT",
      payload: {
        id,
        amount,
      },
    };
  }

  function updateCounterName(id, name) {
    return {
      type: "UPDATE_NAME",
      payload: {
        id,
        name,
      },
    };
  }

  function resetCounter(id) {
    return {
      type: "RESET",
      payload: id,
    };
  }

  function addCounter() {
    return {
      type: "ADD_COUNTER",
    };
  }

  function removeCounter(id) {
    return {
      type: "REMOVE_COUNTER",
      payload: id,
    };
  }

  function removeAllCounters() {
    return {
      type: "REMOVE_ALL_COUNTERS",
    };
  }

  function render() {
    console.log(store.getState());

    if (store.getState().length) {
      showCountersTemplate();
    } else {
      showNoCounterstemplate();
    }

    setListeners();
  }

  function showCountersTemplate() {
    let template = "";

    store.getState().forEach((item) => {
      template += `<div class="counter" data-id="${item.id}">
      <h2>${item.name}</h2>
      <p>Amount : ${item.amount}</p>

      <div class="counter__value-container">
        <button class="counter__decrement">-</button>
          <strong class="counter__value">${item.value}</strong>
        <button class="counter__increment">+</button>
      </div>
      <br/>

      <button class="counter__reset">Reset</button>
      <button class="counter__edit btn btn-primary">Edit Counter</button>
      <button class="btn-danger counter__remove btn-danger">Remove Counter</button>
      <hr />
    </div>`;
    });

    $("#counter-list").innerHTML = template;
  }

  function showNoCounterstemplate() {
    const noCounterstemplate = `
    <h2>You don't have any counters</h2>
    <p>Try to add one in the button above</p>
    `;

    $("#counter-list").innerHTML = noCounterstemplate;
  }

  function setListeners() {
    listener(".counter__increment", "click", function (dataId) {
      store.dispatch(incrementCounter(dataId));
    });

    listener(".counter__decrement", "click", function (dataId) {
      store.dispatch(decrementCounter(dataId));
    });

    $$(".counter__reset").forEach((item) => {
      const dataId = parseInt(item.parentElement.getAttribute("data-id"));

      item.addEventListener("click", function () {
        showModalConfirm({
          title: `Reseting ${getCounterName(dataId)}...`,
          id: dataId,
          callback: (_id) => store.dispatch(resetCounter(_id)),
        });
      });
    });

    $$(".counter__remove").forEach((item) => {
      const dataId = parseInt(item.parentElement.getAttribute("data-id"));

      item.addEventListener("click", function () {
        showModalConfirm({
          title: `Removing ${getCounterName(dataId)}...`,
          id: dataId,
          callback: (_id) => store.dispatch(removeCounter(_id)),
        });
      });
    });

    $$(".counter__edit").forEach((item) => {
      item.addEventListener("click", function () {
        const dataId = parseInt(item.parentElement.getAttribute("data-id"));

        showModalEdit(dataId);
      });
    });
  }

  function showModalConfirm(obj) {
    Swal.fire({
      title: obj.title,
      icon: "info",
      showDenyButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        obj.callback(obj.id);
      }
    });
  }

  function showModalEdit(dataId) {
    const template = `
        <div>
          <label>
            <span>Name:</span>
            <input class="counter__name" type="text"/>
          </label>
          <label>
            <span>Amount:</span>
            <input class="counter__amount" type="number"/>
          </label>
        </div>
      `;

    Swal.fire({
      title: `Editing ${getCounterName(dataId)}...`,
      html: template,
      icon: "info",
      showDenyButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        edtiCounter({
          name: $(".counter__name").value,
          amount: $(".counter__amount").value,
          id: dataId,
        });
      }
    });
  }

  function listener(element, event, fn) {
    $$(element).forEach((item) => {
      const dataId = parseInt(
        item.parentElement.parentElement.getAttribute("data-id")
      );

      item.addEventListener(event, function () {
        fn(dataId);
      });
    });
  }

  function edtiCounter(obj) {
    const id = obj.id;
    const amount = obj.amount;
    const name = obj.name;

    if (amount) {
      store.dispatch(updateAmountCount(id, parseInt(obj.amount)));
    }

    if (name) {
      store.dispatch(updateCounterName(id, obj.name));
    }
  }

  function getCounterName(id) {
    const state = store.getState();
    let index = state.findIndex((item) => item.id === id);
    return state[index].name;
  }
})();