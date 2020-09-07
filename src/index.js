import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './store/reducers'
import { BrowserRouter } from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyDmCmlQRYWx4n5yjowREef2Uvz2aKubpjY",
  authDomain: "opendocs-95a05.firebaseapp.com",
  databaseURL: "https://opendocs-95a05.firebaseio.com",
  projectId: "opendocs-95a05",
  storageBucket: "opendocs-95a05.appspot.com",
  messagingSenderId: "565193328209",
  appId: "1:565193328209:web:f1c4e6dabe1abee71a1a70"
}

firebase.initializeApp(firebaseConfig);

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
