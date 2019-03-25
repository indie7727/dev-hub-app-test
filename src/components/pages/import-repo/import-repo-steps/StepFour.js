import React from 'react'
import { Link } from 'react-router';
import {importUrl} from '../../../../constants'

export class StepFour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addons: props.getStore().addons
    };
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  isValidated() {
    return true;
  }

  validationCheck() {
    return;
  }

  handleToggle(event){
    var index = event.target.id
    this.state.addons[index].selected = !this.state.addons[index].selected
    this.props.updateStore({addons: this.state.addons});
    this.setState({addons: this.state.addons})
  }

  handleInputChange(event){
    var info = event.target.name.split("-")
    this.state.addons[info[0]].args[info[1]].value = event.target.value
    this.props.updateStore({addons: this.state.addons});
    this.setState({addons: this.state.addons})
  }

  handleFileChange(event){
    var fileReader = new FileReader()
    var info = event.target.name.split("-")

    fileReader.onload = e => {
      this.state.addons[info[0]].args[info[1]].value = e.target.result
      this.props.updateStore({addons: this.state.addons});
      this.setState({addons: this.state.addons})
    }
    fileReader.readAsText(event.target.files[0])
  }

  processScmUrl(scmUrl){
    if(scmUrl[scmUrl.length-1] === '/')
      scmUrl = scmUrl.slice(0, -1)
    if(!scmUrl.endsWith(".git"))
      scmUrl += '.git'
    return scmUrl
  }

  storeInDbAndCallOnboardAPI(){
    var scmUrl = this.props.getStore().scmUrl
    this.props.updateStore({scmUrl: this.processScmUrl(scmUrl)});
    var scmUrlSplit = this.processScmUrl(scmUrl).split('/')
    var repoName = scmUrlSplit[scmUrlSplit.length - 1].split('.')[0]

    firebase.firestore().collection("repos").doc(this.props.getStore().scmUrl.replace(/\//g, '+')).set({
      isImported: false,
      isImporting: true,
      importData: this.props.getStore(),
      name: repoName,
    }, { merge: true })

    firebase.firestore().collection("userRepos").doc(this.props.auth.getProfile().nickname).set({
      repos: {
        [this.props.getStore().scmUrl.replace(/\//g, '+')] :{
          name: repoName,
          permission: "push"
        }
      }
    }, { merge: true })

    fetch(importUrl,
    {
        method: "POST",
        body: JSON.stringify(Object.assign(this.props.getStore(), 
                                           {auth0Id: this.props.auth.getProfile().sub,
                                            scmUsername: this.props.auth.getProfile().nickname,
                                            isEdit: this.props.edit ? true: false}))
    })
  }

  render () {   
    return (
      <div className="addons-main">
        <label>Addons<span className="aux"></span></label>
        <div id="dynamicInput">
          <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.addons.map((data, index) => 
              <div className="addon-box-outer">
                <x-box class="addon-box">
                  {data.selected ? 
                  <x-switch 
                    onClick={this.handleToggle.bind(this)} 
                    skin="big" 
                    id={index}
                    toggled
                  >
                  </x-switch> : 
                  <x-switch 
                    onClick={this.handleToggle.bind(this)} 
                    skin="big" 
                    id={index}
                  >
                  </x-switch>}
                  <div style={{display: "flex", flexDirection: "column"}}>
                    <x-label class="addon-label">
                      <x-box vertical>
                        <strong className="addon-header">{data.name}</strong>
                        <span className="addon-description">{data.description}</span>
                      </x-box>
                    </x-label>
                    <div style={{display: "flex", flexDirection: "row", marginTop: "10px"}}>
                      <div className="addons-text-main">
                        {data.selected && data.args.length > 0 ? data.args.map((addonInput, idx) => 
                          <span className="addon-input-text">{addonInput.key}:</span>) : (<div></div>)
                        }
                      </div>
                      <div style={{display: "flex", flexDirection: "column", width: "40.5%"}}>
                        {data.selected && data.args.length > 0 ? data.args.map((addonInput, idx) =>
                          addonInput.type === "text" ?
                            <input 
                              name={index + "-" + idx}
                              value={addonInput.value}
                              onChange={this.handleInputChange.bind(this)}
                              className="addon-text-input-box"
                            >
                            </input> : (addonInput.type === "file" ?
                            <input 
                              name={index + "-" + idx}
                              onChange={this.handleFileChange.bind(this)}
                              className="addon-file-input-box"
                              type="file"
                            >
                            </input> : <div></div>)
                          ) : (<div></div>)
                        }
                      </div>
                      <div className="addons-link-main">
                        {data.selected && data.args.length > 0 ? data.args.map((addonInput, idx) => 
                          addonInput.link ? 
                            <a href={addonInput.link} target="_blank" className="addon-input-link">Sample</a>: 
                            <div className="addon-input-link"></div>) : (<div></div>)
                        }
                      </div>
                    </div>
                  </div>
                </x-box>
              </div>
            )}
          </div>
        </div>
        <Link 
          to={{ 
            pathname: "repos/" + this.processScmUrl(this.props.getStore().scmUrl).replace(/\//g, '+'),
          }} 
          style={{float: 'left'}}
          onClick={this.storeInDbAndCallOnboardAPI.bind(this)}
        >
          <button className="import-button btn btn-prev btn-primary btn-lg pull-right">
            Import Repo
          </button>
        </Link>
      </div>
    )
  }
}
