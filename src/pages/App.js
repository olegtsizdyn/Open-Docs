import React from 'react';
import Home from './home/home';
import Documents from './documents/documents';
import Header from '../components/header/header';
import Navigation from '../components/navigation/navigation';
import * as firebase from 'firebase';
import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux'
import { setLoginState } from '../store/auth/actions'
import { Redirect } from 'react-router-dom';

import "../scss/main.scss";

function App({ auth: { isLogin }, setLoginState, setNavToggle }) {

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDispatch(setLoginState(true))
      }
    })
  }, [])

  return (
    <div className={isLogin ? "wrapper_admin" : "wrapper"}>
      {isLogin &&
        <div className="nav_bar">
          <Navigation />
        </div>
      }
      <div className={isLogin ? "main_content_admin" : "main_content"}>
        <Header />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={Home} />
          {!isLogin &&
            <Redirect to="/home" />
          }
          <Route path="/documents" component={Documents} />
        </Switch>
      </div>
    </div>
  );
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

const mapDispatchToProps = {
  setLoginState,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
