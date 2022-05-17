import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

// import { applyMiddleware, createStore } from "redux"
//
// import { createLogger } from 'redux-logger'
// import thunk from "redux-thunk"
// import promise from "redux-promise-middleware"
//
// import rootReducer from '../_reducers';
//
// const middleware = applyMiddleware(promise(), thunk, createLogger())
//
// export const store = createStore(rootReducer, middleware);
