import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import {
  createReactNavigationReduxMiddleware,
  createNavigationReducer
} from "react-navigation-redux-helpers";

import clientReducer from "./reducers/clientReducer";
import uiReducer from "./reducers/uiReducer";

import AppNavigator from "../screens/Navigators/AppNavigator";

//const navReducer = createNavigationReducer(AppNavigator);

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};

const rootReducer = combineReducers({
  clients: clientReducer,
  ui: uiReducer,
  nav: navReducer
});

const navReduxMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);

let composeEnhancer = compose;

if (__DEV__) {
  composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk, navReduxMiddleware))
  );
};

export default configureStore;
