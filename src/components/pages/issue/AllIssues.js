import React, { Component } from 'react'
import {timeDifference} from '../../../utils/time'
var ReactTable = require("react-table").default;
import moment from 'moment'

export default class AllIssues extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        issues: []
    }
  }

  getTimeEstimateString(hours, mins){
    var z = "0";
    if(hours === "")
        hours = z
    if(mins === "")
        mins = z
    return hours + "h " + mins + "m";
  }

  componentWillMount(){
    const db = firebase.firestore();
    var issues = {};  
    db.collection("userRepos").doc(this.props.auth.getProfile().nickname).onSnapshot((doc) => {
        if(!doc.data())
          return  
        Object.keys(doc.data().repos).map((key) => { 
            db.collection("repos").doc(key).onSnapshot((doc) => {      
                var repoData = doc.data();
                if(!repoData.issues)
                    return
                Object.keys(repoData.issues).map((issueId) => {
                    var issueData = repoData.issues[issueId]
                    if(issueData.status === "Closed")
                        return
                    
                    if(issueData.assignee === this.props.auth.getProfile().nickname){
                        var timeEstimateString = this.getTimeEstimateString(issueData.timeEstimateHours, 
                                                                            issueData.timeEstimateMins)
                        issues[issueId] = Object.assign(issueData,
                                                        {timeEstimate: timeEstimateString,
                                                        repoName: repoData.name,
                                                        detail: {title: issueData.title,
                                                                 description: issueData.description,
                                                                 url: issueData.url}})
                    }
                })
                this.setState({issues: issues});
            })
        })
      });
  }

  render() {
      const columns = [
        {
            Header: "Repo",
            accessor: 'repoName',
            minWidth: 150,
            style: { 'white-space': 'unset', 'overflow-wrap': 'break-word', 'line-height': '1.2em', 'font-size': "0.85em" },
        },
        {
            Header: 'Detail',
            accessor: 'detail',
            sortable: false,
            minWidth: 300,
            style: { 'white-space': 'unset', "text-align": "left", "padding": "15px 22px" },
            Cell: props => <div>
                <span className='all-issues-title'>{props.value.title}</span>
                <br className="all-issues-line-break"></br>
                <br className="all-issues-line-break"></br>
                <a href={props.value.url} className="all-issues-link" target="_blank">Link</a>
                <br></br><br></br>
                <span className='all-issues-description'>{props.value.description}</span>
            </div>
        }, 
        {
            Header: "Status",
            accessor: 'status',
            Cell: props => {
                if(props.value === "To-Do")
                    return <span className="all-issues-status all-issues-todo-status">{props.value}</span>
                else if(props.value === "In Progress")
                    return <span className="all-issues-status all-issues-in-progress-status">{props.value}</span>
                else if(props.value === "Pending PR Merge")
                    return <span className="all-issues-status all-issues-pending-pr-merge-status">{props.value}</span>
            },
            width: 150
        },
        {
            Header: "Start Time",
            accessor: 'startTime',
            width: 120,
            Cell: props => {
                if(props.value === "N/A")
                    return <span style={{fontSize: "0.87em"}}>{props.value}</span>
                else
                    return <span style={{fontSize: "0.87em"}}>
                        {timeDifference(moment().utc().unix(), props.value)}
                    </span>
            }
        },
        {
            Header: "Time Estimate",
            accessor: 'timeEstimate',
            width: 120,
            sortMethod: (a, b, desc) => {
                var h1 = a.split(' ')[0]
                h1 = parseInt(h1[h1.length-1])

                var m1 = a.split(' ')[1]
                m1 = parseInt(m1[m1.length-1])
                
                var h2 = b.split(' ')[0]
                h2 = parseInt(h2[h2.length-1])

                var m2 = b.split(' ')[1]
                m2 = parseInt(m2[m2.length-1])
                
                if (h1 > h2 || (h1 == h2 && m1 > m2)) {
                  return 1;
                }
                else if (h2 > h1 || (h1 == h2 && m2 > m1)) {
                  return -1;
                }
                // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
                return 0;
            }
        },
        {
            Header: 'Value Estimate',
            accessor: "value" ,
            Cell: props => <span style={{color: "darkgreen"}}>{"$".repeat(props.value / 25 + 1)}</span>,
            width: 120
        },
    ]
     
      return <ReactTable
        data={Object.values(this.state.issues)}
        columns={columns}
        defaultSorted={[{ 
            id: 'value',
            desc: true
        }]}
        showPageSizeOptions={false}
        defaultPageSize={10}
        showPageJump={false}
        resizable={false}
      />
  }
}
