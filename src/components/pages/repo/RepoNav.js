import React, { Component } from 'react'
import { Link } from 'react-router'
import { withRouter } from 'react-router';
import { browserHistory } from 'react-router';

class RepoNav extends Component {
  constructor(props, context) {
    super(props, context)
    var pathname = this.props.location.pathname;
    this.state = {
      profile: props.auth.getProfile(),
      selectedIssueItem: pathname.search('/issues/') !== -1 ? pathname.split('/')[4].split('?')[0] : ""
    }
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile })
    })
    browserHistory.listen( location =>  {
      var str = location.hash;
      this.setState({selectedIssueItem: str.search('/issues/') !== -1 ? str.split('/')[4].split('?')[0] : ""})
     });
  }

  render() {
    return (
        <div className="repo-nav"> 
        <div className="repo-nav-title">
          <h4 className="repo-nav-title-text">{this.props.repoData.name}</h4>
          <Link 
            to={{
              pathname: "/edit_repo",
              state: {store: this.props.repoData.importData}
            }}
          >
            <x-icon class="repo-nav-edit-icon" name="edit" iconset="node_modules/xel/images/icons.svg"></x-icon>
          </Link>
        </div>

        {this.props.repoData.isImported ? (
          <div>
            <div className="repo-nav-issue-main">
              <h4 className='issue-heading'>Issues</h4>
              <Link className="new-issue-nav-link" to={'/repos/' + this.props.repoId + '/add_issue'}>
                  <x-icon class="issue-add-icon" name="add-circle-outline" iconset="node_modules/xel/images/icons.svg"></x-icon>
              </Link>
            </div>
            {this.props.repoData.issues ? Object.keys(this.props.repoData.issues).map((key) => {
                let data = this.props.repoData.issues[key];
                if(data.status === "Closed")
                  return
                if(data.assignee !== this.props.auth.getProfile().nickname)
                  return (<div></div>)
                return (<div className={'issue-item'}> 
                  <a 
                    className={'issue-item-content ' + (key === this.state.selectedIssueItem ? "issue-item-selected": "")}
                    href={'#/repos/' + this.props.repoId + '/issues/' + key}
                  >
                    <div className='issue-item-title'>{data.title}</div>
                    <div className='issue-item-description'>
                      {data.description.length > 65 ? data.description.slice(0,61) + ' ...' : 
                        (data.description.length === 0 ? "N/A": data.description)}
                    </div>
                  </a>
                </div>)
            }): <div></div>}
          </div>) : <div></div>
        }

      </div>
    )
  }
}

export default withRouter(RepoNav)