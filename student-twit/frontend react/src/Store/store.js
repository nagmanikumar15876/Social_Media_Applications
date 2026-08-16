import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import authReducer from "./Auth/Reducer";
import tweetReducer from "./Tweet/Reducer";
import { themeReducer } from "./Theme/Reducer";
import { messageReducer } from "./Message/Reducer";
// Add to your combineReducers in store.js
import { educationReducer } from "./Education/Reducer";
import { clubReducer } from './Club/Reducer';



const rootReducers=combineReducers({
auth:authReducer,
twit:tweetReducer,
theme:themeReducer,
message:messageReducer,
education: educationReducer,
club: clubReducer
})
export const store=legacy_createStore(rootReducers,applyMiddleware(thunk))