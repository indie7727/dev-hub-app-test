import React, { Component } from 'react'
import RepoNav from './RepoNav'
import { browserHistory, withRouter } from 'react-router';

class RepoLayout extends Component {
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
            }
        },
        repoId: null
    }
    browserHistory.listen(location =>  {
        if(!location.hash.startsWith("#/repos/"))
            return
        const db = firebase.firestore();
        db.collection("repos").doc(location.hash.split('/')[2].split('?')[0]).onSnapshot((doc) => {      
           this.setState({
             repoData: doc.data(),
             repoId: doc.id
          });
        });
    })
  }
    
  componentDidMount(){
    const db = firebase.firestore();
    db.collection("repos").doc(this.props.params.repoId).onSnapshot((doc) => {      
        this.setState({
          repoData: doc.data(),
          repoId: doc.id
        });
    })
  }

  render() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth,
        repoData: this.state.repoData,
        repoId: this.state.repoId,
      })
    }
    
    return (
        <div className="repo-layout">
            <RepoNav 
              auth={this.props.route.auth} 
              repoData={this.state.repoData} 
              repoId={this.state.repoId} 
            />
            <div className="repo-main">
                {children}
            </div>
        </div>
    )
  }
}

export default withRouter(RepoLayout)