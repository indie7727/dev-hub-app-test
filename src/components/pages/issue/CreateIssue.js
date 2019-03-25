import React, { Component } from 'react'
import { Link } from 'react-router';
import { issueUrl } from '../../../constants';

export default class CreateIssue extends Component {
  constructor(props, context) {
    super(props, context)
    this.loggedInUsername = this.props.auth.getProfile().nickname;
    this.state = {
        id: this.makeid(16),
        title: "",
        description: "",
        value: "0",
        timeEstimateHours: "",
        timeEstimateMins: "",
        assignee: this.loggedInUsername,
        type: "Development",
        assignees: []
    };
  }

  makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  componentWillMount(){
    var assignees = [];
    const db = firebase.firestore();
    const fieldPath = new firebase.firestore.FieldPath("repos", this.props.repoId, "name")
    db.collection("userRepos").where(fieldPath, "==", this.props.repoData.name).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc) => {
        assignees.push(doc.id)
        this.setState({assignees: assignees})
      })
    })
  }

  createIssue() {      
    firebase.firestore().collection("repos").doc(this.props.repoId).set({
      issues: {
        [this.state.id] :{
          title: this.refs.title.value,
          id: this.state.id,
          description: this.refs.description.value,
          timeEstimateHours: this.refs.timeEstimateHours.value,
          timeEstimateMins: this.refs.timeEstimateMins.value,
          assignee: this.refs.assignee.value,
          value: this.refs.value.value,
          type: this.refs.type.value,
          status: "To-Do",
          startTime: "N/A",
          events: [],
          branch: "N/A",
          pr: "N/A", 
        }
      }
    }, { merge: true })

    var hours = "0", mins = "0";
    if(this.refs.timeEstimateHours.value !== "")
      hours = this.refs.timeEstimateHours.value
    if(this.refs.timeEstimateMins.value !== "")
      mins = this.refs.timeEstimateMins.value
    fetch(issueUrl,
    {
        method: "POST",
        body: JSON.stringify({
          id: this.state.id,
          title: this.refs.title.value,
          description: this.refs.description.value,
          assignee: this.refs.assignee.value,
          value: this.refs.value.value / 25 + 1,
          timeEstimate: hours + "h " + mins + "m",
          type: this.refs.type.value,
          scmUrl: this.props.repoData.importData.scmUrl,
          auth0Id: this.props.auth.getProfile().sub,
        })
    })
  }

  render() {
    return (
        <div className="create-issue">
            <h4 className="create-issue-title"> Create Issue </h4>
            <div className="create-issue-main">
                <div className="create-issue-basic-section">
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                      <label>Title*</label>
                  </div>
                  <input 
                      ref="title"
                      className="create-issue-title-field"
                      type="text"
                      defaultValue={this.state.title}
                      onChange={this.handleChange}
                  />
                  <div style={{display: "flex"}}>
                      <label>Description*<span className="aux"></span></label>
                  </div>
                  <textarea 
                      ref="description"
                      className="create-issue-description"
                      name="Text1" 
                      cols="40" 
                      rows="3"
                      defaultValue={this.state.description}
                      onChange={this.handleChange}
                  ></textarea>
                </div>
                <div className="create-issue-estimation-section">
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                      <label>Time Estimate*</label>
                  </div>
                  <div style={{display: "flex", marginBottom: "25px"}}>
                    <input 
                        ref="timeEstimateHours"
                        className="create-issue-time-estimate create-issue-time-estimate-hours"
                        type="number"
                        defaultValue={this.state.timeEstimateHours}
                        onChange={this.handleChange}
                    />
                    <div className="create-issue-time-estimate-text">hr</div>
                    <input 
                        ref="timeEstimateMins"
                        className="create-issue-time-estimate create-issue-time-estimate-mins"
                        type="number"
                        defaultValue={this.state.timeEstimateMins}
                        onChange={this.handleChange}
                    />
                    <div className="create-issue-time-estimate-text">min</div>
                  </div>
                  <div style={{display: "flex"}}>
                      <label>Value Estimate*<span className="aux"></span></label>
                  </div>
                  <x-slider 
                    class="create-issue-slider" 
                    ref="value" 
                    step="25"
                    value="0"
                    onChange={this.handleChange}
                  >
                    <x-label class="create-issue-value-string" value="0">$</x-label>
                    <x-label class="create-issue-value-string" value="25">$$</x-label>
                    <x-label class="create-issue-value-string" value="50">$$$</x-label>
                    <x-label class="create-issue-value-string" value="75">$$$$</x-label>
                    <x-label class="create-issue-value-string" value="100">$$$$$</x-label>
                  </x-slider>
                </div>

                <div style={{display: "flex"}}>
                  <div className="create-issue-issue-type-section">
                    <div style={{display: "flex"}}>
                        <label>Type*<span className="aux"></span></label>
                    </div>
                    <select className="create-issue-issue-type" ref="type">
                      <option value="Development">Development</option>
                      <option value="Not development">Not development</option>
                    </select>
                  </div>

                  <div className="create-issue-assignee-section">
                    <div>
                        <label>Assignee*<span className="aux"></span></label>
                    </div>
                    <select 
                      className="create-issue-assignee" 
                      ref="assignee" 
                      onChange={this.handleChange}
                    >
                      <option key={this.loggedInUsername} value={this.loggedInUsername} >{this.loggedInUsername}</option>
                      {this.state.assignees.map((data)=> {
                        if(data !== this.loggedInUsername)
                          return <option key={data} value={data}>{data}</option>
                      })}
                    </select>
                  </div>
                </div>
                <Link 
                    to={{ 
                      pathname: "repos/" + this.props.repoId + "/issues/" + this.state.id,
                    }} 
                    onClick={this.createIssue.bind(this)}
                  >
                    <button className="create-issue-button btn btn-prev btn-primary btn-lg pull-right">
                      Create Issue
                    </button>
                  </Link>
            </div>
      </div>
    )
  }
}
