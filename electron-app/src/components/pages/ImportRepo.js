import React, { Component } from 'react'
const path = require('path')

export default class ImportRepo extends Component {
  constructor(props, context) {
    super(props, context)
    console.log("scm_url", props.location.state.scmUrl)
  }

  componentDidMount () {
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.innerHTML = `
    function getCommandOutput() { return document.getElementById("command-output");  };
    function getStatus()      { return document.getElementById("status");  };
    backgroundProcess("${this.props.location.state.scmUrl}");`;
    document.body.appendChild(script);
  }

  render() {
    return (
      <div className="new-project">
        <h3 className="new-project-title"> Importing repo ... </h3>
        <textarea className="shell" rows="20" cols="90" id="command-output" disabled="true"></textarea>
        <div className="shell" id="status"></div>
      </div>
    )
  }
}
