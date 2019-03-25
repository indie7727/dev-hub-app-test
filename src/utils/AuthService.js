// src/utils/AuthService.js
import { EventEmitter } from 'events'
import Auth0Lock from 'auth0-lock'
import { hashHistory } from 'react-router'

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirect: false,
        sso: false
      },
      theme: {
        logo: 'https://cdn-images-1.medium.com/max/392/1*SKlaVaE0rzQGE0elgMfeiw@2x.png',
        primaryColor: '#31324F'
      },
      languageDictionary: {
        title: "DevHub Login",
      },
      autoclose: true
    })
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
    this.setProfile = this.setProfile.bind(this)
    this.logout = this.logout.bind(this)
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.accessToken)

    this.lock.getProfile(authResult.accessToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else {
        firebase.firestore().collection("users").doc(profile.nickname).set({
          email: profile.email,
          username: profile.nickname,
          auth0Id: profile.sub,
          name: profile.name,
          contributions: {}
        })
        this.setProfile(profile)
        
        // navigate to the home route
        hashHistory.replace('/')
      }
    })
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  setProfile(profile) {
    // Saves profile data to local storage
    localStorage.setItem('profile', JSON.stringify(profile))
    this.emit('profile_updated', profile)
  }

  getProfile() {
    // Retrieves the profile data from local storage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken()
  }

  setToken(accessToken) {
    // Saves user token to local storage
    localStorage.setItem('accessToken', accessToken)
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('accessToken')
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    this.emit('profile_updated', {})
  }
}
