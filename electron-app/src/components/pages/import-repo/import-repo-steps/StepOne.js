import React from 'react'
import {adminCheckUrl} from '../../../../constants'

export class StepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scmUrl: props.getStore().scmUrl,
      replicaCount: props.getStore().replicaCount
    };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().scmUrl != userInput.scmUrl || this.props.getStore().replicaCount != userInput.replicaCount) {
          this.props.updateStore(userInput);
        }

        isDataValid = true;
    }
    else {
        // if anything fails then update the UI validation state but NOT the UI Data State
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }

    return isDataValid;
  }

  validationCheck() {
    if (!this._validateOnDemand)
      return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

  _validateData(data) {
    return  {
      replicaCountVal: (data.replicaCount >= 0), // required: anything besides N/A
      scmUrlVal: /^https?:\/\/.+\..+\/.+\/.+$/.test(data.scmUrl) // required: regex w3c uses in html5
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      replicaCountValMsg: val.replicaCountVal ? '' : 'A valid replica count is required',
      scmUrlValMsg: val.scmUrlVal ? '' : 'A valid repo url is required'
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      replicaCount: this.refs.replicaCount.value,
      scmUrl: this.refs.scmUrl.value
    };
  }

  onKeyPress(event) {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
     if (/\+|-/.test(keyValue))
       event.preventDefault();
   }

  render () {
    let notValidClasses = {};

    if (typeof this.state.scmUrlVal == 'undefined' || this.state.scmUrlVal) {
      notValidClasses.scmUrlCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.scmUrlCls = 'has-error col-md-8';
       notValidClasses.scmUrlValGrpCls = 'val-err-tooltip';
    }

    if (typeof this.state.replicaCountVal == 'undefined' || this.state.replicaCountVal) {
        notValidClasses.replicaCountCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.replicaCountCls = 'has-error col-md-8';
       notValidClasses.replicaCountValGrpCls = 'val-err-tooltip';
    }

    return (
      <div className="step-div">
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <label>Repo Url*&nbsp;&nbsp;<span style={{fontSize: "0.95em"}}>(Admin access required)</span><span className="aux"></span></label>
          <div className={notValidClasses.scmUrlValGrpCls}>{this.state.scmUrlValMsg}</div>
        </div>
        <input 
          ref="scmUrl"
          className="scm-url"
          type="url"
          defaultValue={this.state.scmUrl}
          pattern="https?://.+\..+/.+/.+" 
        />
        <div style={{display: "flex"}}>
          <label>Replica Count*<span className="aux"></span></label>
          <div className={notValidClasses.replicaCountValGrpCls}>{this.state.replicaCountValMsg}</div>
        </div>
        <input 
          ref="replicaCount"
          className="replica-count"
          type="number"
          onKeyPress={this.onKeyPress.bind(this)}
          min="0"
          defaultValue={this.state.replicaCount}
        />
      </div>
    )
  }
}