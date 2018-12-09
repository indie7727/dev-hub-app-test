import React, { Component } from 'react'
import { Link } from 'react-router'
import AuthService from '../../utils/AuthService'
var emoji = require('node-emoji')

export default class Home extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div className="home">
        <div className="home--features">
          <h2>Welcome to Dev Hub!</h2>
          <h1>{emoji.get(':wave:')}</h1>
        </div>
      </div>
    )
  }
}
