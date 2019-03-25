import React, { Component } from 'react'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import { branchUrl, issueUrl, prUrl } from '../../../constants';
import moment from 'moment'
import {timeDifference, getDateStringFromObj} from '../../../utils/time'

export default class IssueDetail extends Component {
  constructor(props, context) {
    super(props, context)
  }

  getTimeEstimateString(hours, mins){
    var z = "0";
    if(hours === "")
        hours = z
    if(mins === "")
        mins = z
    return hours + "h " + mins + "m";
  }

  startWorkingOnIssue() {    
    var issueId = this.props.routeParams.issueId
    var issueData = this.props.repoData.issues[issueId]
    var branchNamePlaceholer;
    if(issueData.type !== "Development")
      branchNamePlaceholer = "N/A"
    else
      branchNamePlaceholer = "Creating..."

    firebase.firestore().collection("repos").doc(this.props.repoId).set({
      issues: {
        [issueId] :{
          status: "In Progress",
          startTime: moment().utc().unix(),
          branch: branchNamePlaceholer,
          events: [{
            text: "Started work",
            time: moment().utc().unix()
          }]
        }
      }
    }, { merge: true })

    if(issueData.type !== "Development")
      return

    var branchName = "issue-" + issueData.url.split('/')[issueData.url.split('/').length - 1];
    fetch(branchUrl,
    {
        method: "POST",
        body: JSON.stringify({
          id: issueId,
          scmUrl: this.props.repoData.importData.scmUrl,
          auth0Id: this.props.auth.getProfile().sub,
          branchName: branchName,
        })
    })
  }

  doneWithIssue(){
    var issueId = this.props.routeParams.issueId
    var issueData = this.props.repoData.issues[issueId]
    var prPlaceholer, status;
    if(issueData.type !== "Development"){
      prPlaceholer = "N/A"
      status = "Closed"
    }
    else{
      prPlaceholer = "Creating..."
      status = "Pending PR Merge"
    }

    firebase.firestore().collection("repos").doc(this.props.repoId).set({
      issues: {
        [issueId] :{
          status: status,
          pr: prPlaceholer,
        }
      }
    }, { merge: true })

    var issueNumber = issueData.url.split('/')[issueData.url.split('/').length - 1];
    var branchName = "issue-" + issueNumber;
    if(issueData.type === "Development"){
      fetch(prUrl,
      {
          method: "POST",
          body: JSON.stringify({
            id: issueId,
            scmUrl: this.props.repoData.importData.scmUrl,
            auth0Id: this.props.auth.getProfile().sub,
            branchName: branchName,
            issueNumber: issueNumber
          })
      })
    } else {
      firebase.firestore().collection("users").doc(this.props.auth.getProfile().nickname).get().then((doc) => {
        if(!doc.data())
          return
        var contributions = doc.data().contributions;
        
        var startDate = new Date(issueData.startTime*1000)
        var today = new Date()

        var timeDiff = Math.abs(today.getTime() - startDate.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        var valueToAdd = Math.round( ((issueData.value / 25 + 1) / diffDays) * 100 ) / 100

        for (var d = startDate; d <= today; d.setDate(d.getDate() + 1)) {
          var dateString = getDateStringFromObj(d, 0)
          var valueAddedOnDate = valueToAdd
          if(contributions[dateString])
            valueAddedOnDate += contributions[dateString].value
          firebase.firestore().collection("users").doc(this.props.auth.getProfile().nickname).update({
              [`contributions.${dateString}.value`]: Math.round( valueAddedOnDate * 100 ) / 100,
              [`contributions.${dateString}.issues`]: firebase.firestore.FieldValue.arrayUnion({
                "url": issueData.url,
                "value": valueToAdd
              })
          })
        }
      })

      firebase.firestore().collection("repos").doc(this.props.repoId).update({
        [`issues.${issueId}.events`]: firebase.firestore.FieldValue.arrayUnion({
            "text": "Closed",
            "time": moment().utc().unix()
        })
      });
    
      fetch(issueUrl,
        {
            method: "DELETE",
            body: JSON.stringify({
              scmUrl: this.props.repoData.importData.scmUrl,
              auth0Id: this.props.auth.getProfile().sub,
              issueNumber: issueNumber,
            })
        })
    }
  }

  render() {
    var issueId = this.props.routeParams.issueId

    var issueData = null
    if(this.props.repoData.issues && this.props.repoData.issues[issueId])
      issueData = this.props.repoData.issues[issueId]

    return (
      !issueData ? 
      <div className="import-loading-main">
          <x-throbber class="import-throbber"></x-throbber>
          <h4 className="import-loading-text">Creating Issue ...</h4>
      </div> : 
      <div className="issue-detail-main">
        <div className="issue-detail-content">
          <div className="issue-detail-title">{issueData.title}</div>
          <div className="issue-detail-description">{issueData.description}</div>
          <div className="issue-detail-badges">
            <div className="issue-detail-badge issue-detail-time-badge"> 
              {this.getTimeEstimateString(issueData.timeEstimateHours, issueData.timeEstimateMins)} 
            </div>
            <div className="issue-detail-badge issue-detail-value-badge">
              {"$".repeat(issueData.value / 25 + 1)} 
            </div>
          </div>
          <div className="issue-detail-badges">
            <div className="issue-detail-badge issue-detail-issue-link-badge"> 
              <span className="issue-detail-issue">        
                <img className='issue-detail-issue-icon' src='images/git-issue.png'></img>
                {issueData.url ?
                  <a className="issue-detail-issue-link" href={issueData.url} target="_blank">
                    {issueData.url.split('/')[issueData.url.split('/').length - 1]}
                  </a> :
                  <span style={{fontSize: "0.95em"}}>Creating...</span>
                }
              </span>
            </div>  
            {issueData.branch === "N/A" ? <div></div> :
              <div className="issue-detail-badge issue-detail-branch-badge"> 
                <span className="issue-detail-in-progress-branch">
                  <img className='issue-detail-in-progress-branch-icon' src='images/git-branch.png'></img>
                    {issueData.branch === "Creating..." ?
                      <span style={{fontSize: "0.95em"}}>Creating...</span> :
                      <a className="issue-detail-in-progress-branch-link" href={this.props.repoData.importData.scmUrl.slice(0, this.props.repoData.importData.scmUrl.length-4) + "/tree/" + issueData.branch} target="_blank">
                        {issueData.branch}
                      </a> 
                    } 
                </span>
              </div>
            }
            {issueData.pr === "N/A" ? <div></div> :
              <div className="issue-detail-badge issue-detail-pr-badge"> 
                <span className="issue-detail-pr">
                  <img className='issue-detail-pr-icon' src='images/git-pr.png'></img>
                    {issueData.pr === "Creating..." ?
                      <span style={{fontSize: "0.95em"}}>Creating...</span> :
                      <a className="issue-detail-pr-link" href={issueData.pr} target="_blank">
                        {issueData.pr.split('/')[issueData.pr.split('/').length-1]}
                      </a> 
                    }
                </span>
              </div>
            }
            <div className={"issue-detail-badge issue-detail-status-badge issue-detail-status-badge-" + issueData.status.toLowerCase().replace(/ /g,"-")}> 
                {issueData.status}
            </div> 
          </div>
          <div className="issue-detail-buttons">
            {issueData.status === "To-Do" ? 
              <button 
                className="issue-detail-button issue-detail-button-start-working btn btn-prev btn-primary btn-lg pull-right"
                onClick={this.startWorkingOnIssue.bind(this)}
              >
                Start Working
              </button> : (issueData.status === "In Progress" ?
              <div style={{display: "flex", flexDirection: "column"}}>
                <button 
                  className="issue-detail-button issue-detail-button-issue-completed btn btn-prev btn-primary btn-lg pull-right"
                  onClick={this.doneWithIssue.bind(this)}
                >
                  Issue Completed
                </button> 
              </div>: <div></div>)
            }
          </div>
        </div>
        <div className="issue-detail-events">
          {issueData.events.length > 0 ?
            <VerticalTimeline className="issue-detail-vertical-timeline" animate={false} layout="1-column">
              {issueData.events.map((data) => 
                <VerticalTimelineElement
                  className="vertical-timeline-element"
                  date={timeDifference(moment().utc().unix(), data.time)}
                >
                  {data.text}
                </VerticalTimelineElement>
              )}
            </VerticalTimeline> : <div></div>}
        </div>
      </div>
    )
  }
}
