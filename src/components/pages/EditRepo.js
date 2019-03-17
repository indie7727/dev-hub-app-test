import React, { Component } from 'react'
import StepZilla from "react-stepzilla";
import { StepOne } from './import-repo/import-repo-steps/StepOne'
import { StepTwo } from './import-repo/import-repo-steps/StepTwo'
import { StepThree } from './import-repo/import-repo-steps/StepThree'
import { StepFour } from './import-repo/import-repo-steps/StepFour'
import 'whatwg-fetch'

export default class EditRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false};
    this.title = "Edit Repository"
    this.Store = {};
  }

  componentWillMount() {
    this.Store = this.props.location.state.store
  }

  componentWillUnmount() {}

  getStore() {
    return this.Store;
  }

  updateStore(update) {
    this.Store = Object.assign(this.Store, update)
  }

  render() {
    const steps = 
    [
      {name: 'Basic Info', component: <StepOne auth={this.props.auth} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}}/>},
      {name: 'Env Vars', component: <StepTwo getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}}/>},
      {name: 'Port Mapping', component: <StepThree getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}}/>},
      {name: 'Addons', component: <StepFour auth={this.props.auth} parentState={this.state} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}}/>},
    ] 
    if(this.state.loading){
      return <x-throbber></x-throbber>
    }
    return (
      <div className="import-repo">
        <h4 className="import-repo-title"> {this.title} </h4>
        <div className="import-repo-input-form">
          <StepZilla 
            steps={steps} 
            stepsNavigation={false}
            backButtonText='Back'
            preventEnterSubmission={true}
          />
        </div>
      </div>
    )
  }
}
