import React, { Component } from 'react'
import { Link } from 'react-router'
import { hashHistory } from 'react-router'
import {promoteUrl} from '../../constants'
import { browserHistory, withRouter } from 'react-router';

class Repo extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      repoData: {
        productionData: {
          urls: [],
          version: "N/A",
          activePods: "-",
          requiredPods: "-",
          targetVersion: "N/A"
        },
        stagingData: {
          urls: [],
          version: "N/A",
          activePods: "-",
          requiredPods: "-",
          targetVersion: "N/A"
        },
      },
      version: ""
    }
    browserHistory.listen( location =>  {
      if(!location.hash.startsWith("#/repos/"))
        return
      const db = firebase.firestore();
      db.collection("repos").doc(location.hash.split('/')[2].split('?')[0]).onSnapshot((doc) => {      
        this.setState({
          repoData: doc.data(), 
          version: doc.data().stagingData ? doc.data().stagingData.version : ""});
      });
    });
  }

  componentDidMount(){
    const db = firebase.firestore();
    db.collection("repos").doc(this.props.params.repoId).onSnapshot((doc) => {      
      this.setState({
        repoData: doc.data(), 
        version: doc.data().stagingData ? doc.data().stagingData.version : ""});
    });
  }
 
  handleInputChange(event){
    this.setState({version: event.target.value})
  }

  callPromote(){
    fetch(promoteUrl,
      {
          method: "POST",
          body: JSON.stringify({version: this.state.version,
                                scmUrl: this.state.repoData.importData.scmUrl,
                                appName: this.state.repoData.name.replace(/_/g, '-'),
                                replicaCount: this.state.repoData.importData.replicaCount
                              })
      })
  }

  checkIfProdUpdating() {
    if(this.state.repoData.productionData.version != this.state.repoData.productionData.targetVersion)
      return true
    else if(this.state.repoData.productionData.activePods != this.state.repoData.productionData.requiredPods)
      return true
    return false;
  }

  render() {
    return (
      !this.state.repoData.isImported && this.state.repoData.isImporting ?
        <div className="import-loading-main">
            <x-throbber class="import-throbber"></x-throbber>
            <h4 className="import-loading-text">Importing Repo ...</h4>
        </div> : 
      !this.state.repoData.isImported && !this.state.repoData.isImporting ?
        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
          <div className="repo-nav"> 
            <div className="repo-nav-title">
              <h4 className="repo-nav-title-text">{this.state.repoData.name}</h4>
              <Link 
                to={{
                  pathname: "/edit_repo",
                  state: {store: this.state.repoData.importData}
                }}
              >
                <x-icon class="repo-nav-edit-icon" name="edit" iconset="node_modules/xel/images/icons.svg"></x-icon>
              </Link>
            </div>
          </div>
          <div className="repo-content"> 
            <div className="import-failed-main">
              <img className="import-failed-image" src="images/exclamation.png"></img>
              <h4 className="import-failed-text">Import Failed</h4>
              <span className="import-failed-reason">[ {this.state.repoData.importReason} ]</span>
            </div> 
          </div>
        </div> :
      <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
        <div className="repo-nav"> 
          <div className="repo-nav-title">
            <h4 className="repo-nav-title-text">{this.state.repoData.name}</h4>
            <Link 
              to={{
                pathname: "/edit_repo",
                state: {store: this.state.repoData.importData}
              }}
            >
              <x-icon class="repo-nav-edit-icon" name="edit" iconset="node_modules/xel/images/icons.svg"></x-icon>
            </Link>
          </div>
        </div>
        <div className="repo-content"> 
          <div className="deployment-status">
            <div className={"deployment " + 
                              (this.state.repoData.stagingData.isUpdating? "deployment-updating" : 
                              this.state.repoData.stagingData.isUp? "deployment-up" : "deployment-down")}>
              <h5 className="deployment-heading">Staging</h5>
              <div className="deployment-version">v{this.state.repoData.stagingData.version}</div>
              {this.state.repoData.stagingData.urls.map((url) => 
                <div className="deployment-url">
                  <a href={url} target="_blank">
                    {url}
                  </a>
                </div>
              )}
              
              <div className="deployment-pods">Pods: {this.state.repoData.stagingData.activePods}/{this.state.repoData.stagingData.requiredPods}</div>
            </div>
            <div className={"deployment " + 
                              (this.checkIfProdUpdating() ? "deployment-updating" : 
                              this.state.repoData.productionData.isUp ? "deployment-up" : "deployment-down")}>
              <h5 className="deployment-heading">Production</h5>
              <div className="deployment-version">
                v{this.state.repoData.productionData.version}
                {this.state.repoData.productionData.version!=this.state.repoData.productionData.targetVersion ?
                  <div style={{display: "flex", flexDirection: "row"}}>
                    <x-icon class="version-arrow-icon" name="arrow-forward"></x-icon> 
                    v{this.state.repoData.productionData.targetVersion}
                  </div>: ""}
              </div>
              {this.state.repoData.productionData.urls.map((url) => 
                <div className="deployment-url">
                  <a href={url} target="_blank">
                    {url}
                  </a>
                </div>
              )}
              <div className="deployment-pods">Pods: {this.state.repoData.productionData.activePods}/{this.state.repoData.productionData.requiredPods}</div>
            </div>
          </div>
          <div className="promote">
            <x-icon class="promote-left-icon" name="subdirectory-arrow-right"></x-icon>
            <input 
                name="version-input"
                value={this.state.version}
                onChange={this.handleInputChange.bind(this)}
                className="promote-input-box"
            ></input>
            <button 
              onClick={this.callPromote.bind(this)}
              className="promote-button btn btn-prev btn-primary btn-lg pull-right"
              disabled={this.state.version == this.state.repoData.productionData.version}
            >
              Promote
            </button>
              <x-icon class="promote-right-icon" name="subdirectory-arrow-right"></x-icon>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Repo)