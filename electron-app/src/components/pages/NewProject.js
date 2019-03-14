import React, { Component } from 'react'
import { Link } from 'react-router'
import { hashHistory } from 'react-router'

export default class NewProject extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: '',
      isFormValid: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    if (/^https?:\/\/.+\..+\/.+\/.+$/.test(event.target.value)) {
      this.setState({ isFormValid: true });
    } else {
      this.setState({ isFormValid: false });
    }
  }

  handleSubmit(event) {
    hashHistory.Link('/start-import')
  }

  handleCancel(event) {
    console.log("cancel called")
    hashHistory.replace('/')
  }

  render() {
    return (
      <div className="new-project">
        <h3 className="new-project-title"> Add new project </h3>
        <div className="import-project-input-form">
          <label>SCM URL<span className="aux"></span></label>
          <input type="url" value={this.state.value} onChange={this.handleChange} pattern="https?://.+\..+/.+/.+" />
          <button disabled={!this.state.isFormValid} className="new-project-submit-button">
            {this.state.isFormValid ? <Link className="new-project-submit-link" to={{ pathname: '/import_repo', state: { scmUrl: this.state.value} }}>Add</Link> : "Add"}
          </button>
          <button onClick={this.handleCancel} className="new-project-cancel-button"> Cancel </button>
        </div>
      </div>
    )
  }
}
