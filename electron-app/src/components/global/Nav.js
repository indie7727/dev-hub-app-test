import React, { Component } from 'react'
import AuthService from '../../utils/AuthService'
import { Link } from 'react-router'

export default class Nav extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile()
    }
    console.log(props.auth.getProfile())
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile })
    })
  }

  componentDidMount() {
    console.log(this.props.auth)
  }

  render() {
    const { auth } = this.props
    return (
      <div className="nav">
        <div className="nav--wrapper">
          <div className="nav--user-details">
            <img className="user-avatar" src={this.state.profile.picture} />
            <h5>{this.state.profile.nickname}</h5>
          </div>
          <Link className="new-project-nav-link" to='/new_project'>
            <x-button class="new-project-nav-button">
              <x-box>
                <x-icon name="add-circle-outline" iconset="node_modules/xel/images/icons.svg"></x-icon>
                <x-label>New Project</x-label>
              </x-box>
            </x-button>
          </Link>
          <div className="nav--logout">
            <x-button onClick={auth.logout.bind(this)}>
              <x-box>
                <x-label>Logout</x-label>
                <x-icon name="exit-to-app" iconset="node_modules/xel/images/icons.svg"></x-icon>
              </x-box>
            </x-button>
          </div>
        </div>
      </div>
    )
  }
}
