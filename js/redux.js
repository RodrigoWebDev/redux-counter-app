!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(((e = e || self).Redux = {}));
})(this, function (e) {
  "use strict";
  var t = (function (e) {
      var t,
        r = e.Symbol;
      return (
        "function" == typeof r
          ? r.observable
            ? (t = r.observable)
            : ((t = r("observable")), (r.observable = t))
          : (t = "@@observable"),
        t
      );
    })(
      "undefined" != typeof self
        ? self
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof module
        ? module
        : Function("return this")()
    ),
    r = function () {
      return Math.random().toString(36).substring(7).split("").join(".");
    },
    n = {
      INIT: "@@redux/INIT" + r(),
      REPLACE: "@@redux/REPLACE" + r(),
      PROBE_UNKNOWN_ACTION: function () {
        return "@@redux/PROBE_UNKNOWN_ACTION" + r();
      },
    };
  function o(e, t) {
    var r = t && t.type;
    return (
      "Given " +
      ((r && 'action "' + r + '"') || "an action") +
      ', reducer "' +
      e +
      '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'
    );
  }
  function i(e, t) {
    return function () {
      return t(e.apply(this, arguments));
    };
  }
  function u(e, t, r) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  function c(e, t) {
    var r = Object.keys(e);
    return (
      Object.getOwnPropertySymbols &&
        r.push.apply(r, Object.getOwnPropertySymbols(e)),
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
      r
    );
  }
  function a(e) {
    for (var t = 1; arguments.length > t; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? c(r, !0).forEach(function (t) {
            u(e, t, r[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : c(r).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
          });
    }
    return e;
  }
  function f() {
    for (var e = arguments.length, t = Array(e), r = 0; e > r; r++)
      t[r] = arguments[r];
    return 0 === t.length
      ? function (e) {
          return e;
        }
      : 1 === t.length
      ? t[0]
      : t.reduce(function (e, t) {
          return function () {
            return e(t.apply(void 0, arguments));
          };
        });
  }
  (e.__DO_NOT_USE__ActionTypes = n),
    (e.applyMiddleware = function () {
      for (var e = arguments.length, t = Array(e), r = 0; e > r; r++)
        t[r] = arguments[r];
      return function (e) {
        return function () {
          var r = e.apply(void 0, arguments),
            n = function () {
              throw Error(
                "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch."
              );
            },
            o = {
              getState: r.getState,
              dispatch: function () {
                return n.apply(void 0, arguments);
              },
            },
            i = t.map(function (e) {
              return e(o);
            });
          return a({}, r, { dispatch: (n = f.apply(void 0, i)(r.dispatch)) });
        };
      };
    }),
    (e.bindActionCreators = function (e, t) {
      if ("function" == typeof e) return i(e, t);
      if ("object" != typeof e || null === e)
        throw Error(
          "bindActionCreators expected an object or a function, instead received " +
            (null === e ? "null" : typeof e) +
            '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?'
        );
      var r = {};
      for (var n in e) {
        var o = e[n];
        "function" == typeof o && (r[n] = i(o, t));
      }
      return r;
    }),
    (e.combineReducers = function (e) {
      for (var t = Object.keys(e), r = {}, i = 0; t.length > i; i++) {
        var u = t[i];
        "function" == typeof e[u] && (r[u] = e[u]);
      }
      var c,
        a = Object.keys(r);
      try {
        !(function (e) {
          Object.keys(e).forEach(function (t) {
            var r = e[t];
            if (void 0 === r(void 0, { type: n.INIT }))
              throw Error(
                'Reducer "' +
                  t +
                  "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined."
              );
            if (void 0 === r(void 0, { type: n.PROBE_UNKNOWN_ACTION() }))
              throw Error(
                'Reducer "' +
                  t +
                  "\" returned undefined when probed with a random type. Don't try to handle " +
                  n.INIT +
                  ' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.'
              );
          });
        })(r);
      } catch (e) {
        c = e;
      }
      return function (e, t) {
        if ((void 0 === e && (e = {}), c)) throw c;
        for (var n = !1, i = {}, u = 0; a.length > u; u++) {
          var f = a[u],
            s = e[f],
            d = (0, r[f])(s, t);
          if (void 0 === d) {
            var l = o(f, t);
            throw Error(l);
          }
          (i[f] = d), (n = n || d !== s);
        }
        return (n = n || a.length !== Object.keys(e).length) ? i : e;
      };
    }),
    (e.compose = f),
    (e.createStore = function e(r, o, i) {
      var u;
      if (
        ("function" == typeof o && "function" == typeof i) ||
        ("function" == typeof i && "function" == typeof arguments[3])
      )
        throw Error(
          "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function."
        );
      if (
        ("function" == typeof o && void 0 === i && ((i = o), (o = void 0)),
        void 0 !== i)
      ) {
        if ("function" != typeof i)
          throw Error("Expected the enhancer to be a function.");
        return i(e)(r, o);
      }
      if ("function" != typeof r)
        throw Error("Expected the reducer to be a function.");
      var c = r,
        a = o,
        f = [],
        s = f,
        d = !1;
      function l() {
        s === f && (s = f.slice());
      }
      function p() {
        if (d)
          throw Error(
            "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store."
          );
        return a;
      }
      function h(e) {
        if ("function" != typeof e)
          throw Error("Expected the listener to be a function.");
        if (d)
          throw Error(
            "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribelistener for more details."
          );
        var t = !0;
        return (
          l(),
          s.push(e),
          function () {
            if (t) {
              if (d)
                throw Error(
                  "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribelistener for more details."
                );
              (t = !1), l();
              var r = s.indexOf(e);
              s.splice(r, 1), (f = null);
            }
          }
        );
      }
      function y(e) {
        if (
          !(function (e) {
            if ("object" != typeof e || null === e) return !1;
            for (var t = e; null !== Object.getPrototypeOf(t); )
              t = Object.getPrototypeOf(t);
            return Object.getPrototypeOf(e) === t;
          })(e)
        )
          throw Error(
            "Actions must be plain objects. Use custom middleware for async actions."
          );
        if (void 0 === e.type)
          throw Error(
            'Actions may not have an undefined "type" property. Have you misspelled a constant?'
          );
        if (d) throw Error("Reducers may not dispatch actions.");
        try {
          (d = !0), (a = c(a, e));
        } finally {
          d = !1;
        }
        for (var t = (f = s), r = 0; t.length > r; r++) (0, t[r])();
        return e;
      }
      return (
        y({ type: n.INIT }),
        ((u = {
          dispatch: y,
          subscribe: h,
          getState: p,
          replaceReducer: function (e) {
            if ("function" != typeof e)
              throw Error("Expected the nextReducer to be a function.");
            (c = e), y({ type: n.REPLACE });
          },
        })[t] = function () {
          var e,
            r = h;
          return (
            ((e = {
              subscribe: function (e) {
                if ("object" != typeof e || null === e)
                  throw new TypeError("Expected the observer to be an object.");
                function t() {
                  e.next && e.next(p());
                }
                return t(), { unsubscribe: r(t) };
              },
            })[t] = function () {
              return this;
            }),
            e
          );
        }),
        u
      );
    }),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
