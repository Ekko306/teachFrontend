import userReducer from './features/user/userSlice'
import signalRReducer from "./features/signalR/signalRSlice";
import drawingReducer from "./features/drawing/drawingSlice";
import imagesReducer from './features/images/imagesSlice'

import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux";
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'



// // 这里用了 reudx-persist这个包 在localstorage保存数据 所以看起来很麻烦
const reducers = combineReducers({
    user: userReducer,
    signalR: signalRReducer,
    drawing: drawingReducer,
    images: imagesReducer
});
//
// const persistConfig = {
//     key: 'root',
//     storage
// };
//
// const persistedReducer = persistReducer(persistConfig, reducers);
//
//
const store = configureStore({
    reducer: reducers,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
});
//
export default store;