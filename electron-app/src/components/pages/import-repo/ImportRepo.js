import React, { Component } from 'react'
import StepZilla from "react-stepzilla";
import { StepOne } from './import-repo-steps/StepOne'
import { StepTwo } from './import-repo-steps/StepTwo'
import { StepThree } from './import-repo-steps/StepThree'
import { StepFour } from './import-repo-steps/StepFour'
import {backendAddonsUrl} from '../../../constants'
import 'whatwg-fetch'

export default class ImportRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false};

    this.Store = {
      scmUrl: '',
      replicaCount: 1,
      stagingEnvVars: [{key:'', value:''}],
      productionEnvVars: [{key:'', value:''}],
      previewEnvVars: [{key:'', value:''}],
      portMapping: [{port:'', protocol:'HTTP', public: true, url: ""}],
      addons: []
    };
  }

  componentDidMount() {
    window.fetch(backendAddonsUrl)
    .then(response => response.json())
    .then(json => {
      this.Store.addons = json.addons
      for (var i = 0; i < this.Store.addons.length; i++)
        this.Store.addons[i].selected = false
      for (var i = 0; i < this.Store.addons.length; i++)
        for (var j = 0; j < this.Store.addons[i].args.length; j++)
        {
          var arg_name = this.Store.addons[i].args[j]
          this.Store.addons[i].args[j] = {
            key: arg_name,
            value: ""
          }
        }
    })
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
        <h4 className="import-repo-title"> Import Repository </h4>
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
