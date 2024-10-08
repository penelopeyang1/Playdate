import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import gamesReducer from "./game";
import matchesReducer from "./match";
import clipsReducer from "./clip";
import messagesReducer from "./message";
import usersReducer from "./user";

const rootReducer = combineReducers({
  session: sessionReducer,
  games: gamesReducer,
  matches: matchesReducer,
  clips: clipsReducer,
  messages: messagesReducer,
  users: usersReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
