import React, { Component } from 'react'

export default class Home extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div className="home">
        <div className="home--features">
          <h2>Welcome to Dev Hub!</h2>
          <img className='waving-hand-emoji' src='images/hand-wave.png'></img>
        </div>
      </div>
    )
  }
}
