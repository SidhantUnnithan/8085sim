import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { logger } from "redux-logger";
import rootReducer from "./Reducers/rootReducer";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(logger))
);

export default store;