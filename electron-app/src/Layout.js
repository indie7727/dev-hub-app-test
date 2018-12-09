import React, { Component } from 'react'
import Nav from './components/global/Nav'

export default class Layout extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.route.auth.getProfile()
    }
    console.log(props.route.auth.getProfile())
    props.route.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile })
    })
  }

  render() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance from route to children
      })
    }
    if (!this.props.route.auth.loggedIn()) {
      return (
        <div className="app">
          <a onClick={this.props.route.auth.lock.show()}></a>
        </div>
      )
    } else {
      return (
        <div className="app">
          <Nav auth={this.props.route.auth} />
          <div className="main">
            {children}
          </div>
        </div>
      )
    }
  }
}
