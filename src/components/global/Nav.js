import React, { Component } from 'react'
import AuthService from '../../utils/AuthService'
import { Link } from 'react-router'
import {withRouter} from 'react-router';
import { browserHistory } from 'react-router';

class Nav extends Component {
  constructor(props, context) {
    super(props, context)
    var pathname = this.props.location.pathname;
    this.state = {
      profile: props.auth.getProfile(),
      repos: [],
      selectedRepoItem: pathname.startsWith('/repos/') ? pathname.split('/')[2].split('?')[0] : ""
    }
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile })
    })
    browserHistory.listen( location =>  {
      var str = location.hash;
      this.setState({selectedRepoItem: str.startsWith('#/repos/') ? str.split('/')[2].split('?')[0] : ""})
     });
  }

  checkIfDeploymentIsUpdating(data) {
    if(data.version != data.targetVersion)
      return true
    else if(data.activePods != data.requiredPods)
      return true
    return false;
  }

  checkIfDeploymentIsUp(data) {
    if(data.activePods > 0)
      return true
  }

  componentDidMount() {
    const db = firebase.firestore();
    db.collection("userRepos").doc(this.state.profile.nickname).onSnapshot((doc) => {
      if(!doc.data())
        return
      var userRepos = doc.data().repos;
      var repos = [];

      Object.keys(userRepos).map((key) => {   
        repos.push({
          name: userRepos[key].name,
          id: key,
          isProdUp: false,
          isProdUpdating: false
        });
      })
      this.setState({repos: repos});
      
      for(var i=0;i<repos.length; i++){
        let idx = i;
        db.collection("repos").doc(repos[idx].id).onSnapshot((repoDoc) => {
          repos[idx].isProdUp = repoDoc.data().productionData ? this.checkIfDeploymentIsUp(repoDoc.data().productionData) : false,
          repos[idx].isProdUpdating = repoDoc.data().productionData ? this.checkIfDeploymentIsUpdating(repoDoc.data().productionData) : false          
          this.setState({repos: repos});
        })
      }
    });
  }

  render() {
    const { auth } = this.props
    return (
      <div className="nav">
        <div className="nav--wrapper">
          <Link to='/user_detail'>
            <div className="nav--user-details">
              <img className="user-avatar" src={this.state.profile.picture} />
              <h5>{this.state.profile.nickname}</h5>
            </div>
          </Link>
          
          <Link className="all-issues-nav-link" to='/all_issues'>
            <x-icon class="all-issues-icon" name="reorder" iconset="node_modules/xel/images/icons.svg"></x-icon>
            <h4 className='all-issues-heading'>Issues</h4>
          </Link>

          <div className="nav-repo-main">
            <h4 className='repo-heading'>Repos</h4>
            <Link className="new-repo-nav-link" to='/import_repo'>
                <x-icon class="repo-add-icon" name="add-circle-outline" iconset="node_modules/xel/images/icons.svg"></x-icon>
            </Link>
          </div>

          {this.state.repos.map( (data) =>
            <div className={'repo-item ' + (data.id === this.state.selectedRepoItem ? "repo-item-selected": "")}> 
              <div className={"nav-circle " + (data.isProdUpdating ? "nav-circle-updating" : (data.isProdUp ? "nav-circle-up" : "nav-circle-down"))}></div>
              <a className='repo-item-text' href={'#/repos/' + data.id}>{data.name}</a>
            </div>
          )}

          <div className="nav--logout">
            <x-button class="nav-button" onClick={auth.logout.bind(this)}>
              <x-box>
                <x-label class="nav-label">Logout</x-label>
                <x-icon name="exit-to-app" iconset="node_modules/xel/images/icons.svg"></x-icon>
              </x-box>
            </x-button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Nav)