import React from 'react';
import 'babel-polyfill';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './css/app.scss';
import App from './App';
import 'antd/dist/antd.css';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
