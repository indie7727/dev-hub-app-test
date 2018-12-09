import './styles/app.scss'

import { Config } from '../config'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import AuthService from './utils/AuthService'

import Layout from './Layout'
import Home from './components/pages/Home'
import NewProject from './components/pages/NewProject'
import ImportRepo from './components/pages/ImportRepo'

const auth = new AuthService(Config.auth.clientId, Config.auth.domain)

render((
  <Router history={hashHistory}>
    <Route path="/" component={Layout} auth={auth}>
      <IndexRoute component={Home} />
      <Route path="/new_project" component={NewProject} />
      <Route path="/import_repo" component={ImportRepo} />
    </Route>
  </Router>
), document.getElementById('app'));
