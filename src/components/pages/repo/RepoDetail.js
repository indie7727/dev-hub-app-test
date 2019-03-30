import React, { Component } from 'react'
import { Link } from 'react-router'
import { hashHistory } from 'react-router'
import {promoteUrl} from '../../../constants'

export default class RepoDetail extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      version: this.props.repoData.stagingData ? this.props.repoData.stagingData.version : ""
    }
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.repoData !== prevProps.repoData)
      this.setState({version: this.props.repoData.stagingData ? this.props.repoData.stagingData.version : ""})
  }

  handleInputChange(event){
    this.setState({version: event.target.value})
  }

  callPromote(){
    fetch(promoteUrl,
      {
          method: "POST",
          body: JSON.stringify({version: this.state.version,
                                scmUrl: this.props.repoData.importData.scmUrl,
                                appName: this.props.repoData.name.replace(/_/g, '-'),
                                replicaCount: this.props.repoData.importData.replicaCount
                              })
      })
  }

  checkIfProdUpdating() {
    if(this.props.repoData.productionData.version != this.props.repoData.productionData.targetVersion)
      return true
    else if(this.props.repoData.productionData.activePods != this.props.repoData.productionData.requiredPods)
      return true
    return false;
  }

  render() {
    return (
      !this.props.repoData.isImported && this.props.repoData.isImporting ?
        <div className="import-loading-main">
            <x-throbber class="import-throbber"></x-throbber>
            <h4 className="import-loading-text">Importing Repo ...</h4>
        </div> : 
      !this.props.repoData.isImported && !this.props.repoData.isImporting ?
        <div className="repo-content"> 
          <div className="import-failed-main">
            <img className="import-failed-image" src="images/exclamation.png"></img>
            <h4 className="import-failed-text">Import Failed</h4>
            <span className="import-failed-reason">[ {this.props.repoData.importReason} ]</span>
          </div> 
        </div> :
      <div className="repo-content"> 
        <div className="deployment-status">
          <div className={"deployment " + 
                            (this.props.repoData.stagingData.isUpdating? "deployment-updating" : 
                            this.props.repoData.stagingData.isUp? "deployment-up" : "deployment-down")}>
            <h5 className="deployment-heading">Staging</h5>
            <div className="deployment-version">v{this.props.repoData.stagingData.version}</div>
            {this.props.repoData.stagingData.urls.map((url) => 
              <div className="deployment-url">
                <a href={url} target="_blank">
                  {url}
                </a>
              </div>
            )}
            
            <div className="deployment-pods">Pods: {this.props.repoData.stagingData.activePods}/{this.props.repoData.stagingData.requiredPods}</div>
          </div>
          <div className={"deployment " + 
                            (this.checkIfProdUpdating() ? "deployment-updating" : 
                            this.props.repoData.productionData.isUp ? "deployment-up" : "deployment-down")}>
            <h5 className="deployment-heading">Production</h5>
            <div className="deployment-version">
              v{this.props.repoData.productionData.version}
              {this.props.repoData.productionData.version!=this.props.repoData.productionData.targetVersion ?
                <div style={{display: "flex", flexDirection: "row"}}>
                  <x-icon class="version-arrow-icon" name="arrow-forward"></x-icon> 
                  v{this.props.repoData.productionData.targetVersion}
                </div>: ""}
            </div>
            {this.props.repoData.productionData.urls.map((url) => 
              <div className="deployment-url">
                <a href={url} target="_blank">
                  {url}
                </a>
              </div>
            )}
            <div className="deployment-pods">Pods: {this.props.repoData.productionData.activePods}/{this.props.repoData.productionData.requiredPods}</div>
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
            disabled={this.state.version == this.props.repoData.productionData.version}
          >
            Promote
          </button>
            <x-icon class="promote-right-icon" name="subdirectory-arrow-right"></x-icon>
        </div>
        {this.props.repoData.codefixIssueData ?
          <div className="codefix-issues-main">
            <div className="codefix-issues-content">
              <h4 className="codefix-issues-title">CodeFix Issues</h4>
              {this.props.repoData.codefixIssueData.issuesFound > 0 ? 
              <div className="codefix-issues-issue-data">
                <h5 style={{fontWeight: 500}}>Total Issues: {this.props.repoData.codefixIssueData.issuesFound}</h5>
                <table>
                  <thead>
                    <tr>
                      <th className="codefix-issues-table-header">Insight</th>
                      <th className="codefix-issues-table-header">#Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.repoData.codefixIssueData.issueData.map((data) => 
                    <tr>
                      <td className="codefix-issues-table-value">{data.key}</td>
                      <td className="codefix-issues-table-value">{data.value}</td>
                    </tr>
                    )}
                  </tbody>
                </table>
                <h5 style={{fontWeight: 500, margin: "20px 0px 0px 0px"}}>View Issues : &nbsp;
                  <a style={{color: "blue"}} href={this.props.repoData.codefixIssueData.issuesLink} target="_blank">
                    Link
                  </a>
                </h5>
                <h5 style={{fontWeight: 500, margin: "10px 0px"}}>Create cleanup tickets : &nbsp;
                  <a style={{color: "blue"}} href={this.props.repoData.codefixIssueData.ticketsLink} target="_blank">
                    Link
                  </a>
                </h5>
              </div>:
                <h5>No issues found!</h5>
              }   
              <h5 className='codefix-issues-date'>Date: {this.props.repoData.codefixIssueData.date}</h5>         
            </div>
            <img className='codefix-issues-image' src='images/no-bad-code.gif'></img>
          </div> : 
          <div></div>
        }
      </div>
    )
  }
}

