//react
import React from "react";

//redux
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider, connect } from "react-redux";

//Reducers
import uiReducer from "./src/store/reducers/uiReducer";
import clientReducer from "./src/store/reducers/clientReducer";
import AppNavigator from "./src/screens/Navigators/AppNavigator";
const navReducer = createNavigationReducer(AppNavigator);

//middleware
import thunk from "redux-thunk";

//navigation
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer
} from "react-navigation-redux-helpers";

const appReducer = combineReducers({
  nav: navReducer,
  clients: clientReducer,
  ui: uiReducer
});

let composeEnhancer = compose;

if (__DEV__) {
  composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

// Note: createReactNavigationReduxMiddleware must be run before reduxifyNavigator
const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);

const App = reduxifyNavigator(AppNavigator, "root");
const mapStateToProps = state => ({
  state: state.nav
});
const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
  appReducer,
  composeEnhancer(applyMiddleware(middleware, thunk))
);

export default class Root extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
