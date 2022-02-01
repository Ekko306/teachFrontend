import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from "./pages";
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.min.css';
import '@ant-design/pro-list/dist/list.css';
import { PersistGate } from 'redux-persist/integration/react'
import store from './store/store'
import { persistStore } from 'redux-persist'
import { makeServer } from "./server"
import {Provider} from "react-redux";
import {HubConnectionBuilder} from '@microsoft/signalr'


// let persistor = persistStore(store);
if (process.env.NODE_ENV === "development") {
    // makeServer({ environment: "development" })
}

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          {/*<PersistGate loading={null} persistor={persistor}>*/}
              <App/>
          {/*</PersistGate>*/}
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
