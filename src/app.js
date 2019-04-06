import "./styles/app.scss"

import { Config } from '../config'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import AuthService from './utils/AuthService'

import Layout from './Layout'
import Home from './components/pages/Home'
import NewProject from './components/pages/NewProject'
import ImportRepo from './components/pages/import-repo/ImportRepo'
import EditRepo from './components/pages/import-repo/EditRepo'
import RepoLayout from './components/pages/repo/RepoLayout'
import RepoDetail from './components/pages/repo/RepoDetail'
import RepoExec from './components/pages/repo/RepoExec'
import RepoLogs from './components/pages/repo/RepoLogs'
import AllIssues from './components/pages/issue/AllIssues'
import IssueDetail from './components/pages/issue/IssueDetail'
import CreateIssue from './components/pages/issue/CreateIssue'
import UserDetail from './components/pages/UserDetail'

const auth = new AuthService(Config.auth.clientId, Config.auth.domain)

render((
  <Router history={hashHistory}>
    <Route path="/" component={Layout} auth={auth}>
      <IndexRoute component={Home} />
      <Route path="/new_project" component={NewProject} />
      <Route path="/import_repo" component={ImportRepo} />
      <Route path="/edit_repo" component={EditRepo} />
      <Route path="/all_issues" component={AllIssues} />
      <Route path="/user_detail" component={UserDetail} />
      <Route path="/repos/:repoId" component={RepoLayout} auth={auth}>
        <IndexRoute component={RepoDetail} />
        <Route path="/repos/:repoId/issues/:issueId" component={IssueDetail} />
        <Route path="/repos/:repoId/add_issue" component={CreateIssue} />
      </Route>
    </Route>
    <Route path="/repo_exec/:namespace/:repoName" component={RepoExec} />
    <Route path="/repo_logs/:namespace/:repoName" component={RepoLogs} />
    
  </Router>
), document.getElementById('app'));
