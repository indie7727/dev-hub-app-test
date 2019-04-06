import React, { Component } from 'react'
import { Link } from 'react-router'
import {repoDebugUrl} from '../../../constants'
var remote = require('electron').remote
var fs = eval("require('fs')");

export default class RepoLogs extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        fetch(repoDebugUrl,
        {
            method: "POST",
            body: JSON.stringify({
                namespace: this.props.params.namespace,
                repoName: this.props.params.repoName,
            })
        })
        .then(response => response.json())
        .then(json => {
            const script = document.createElement('script');

            fs.readFile(`${remote.app.getAppPath()}/dist/logs.js`, 'utf-8', (err, data) => {
                data = data.replace("__token__", json.token)
                data = data.replace("__app_name__", json.app_name)
                data = data.replace("__namespace__", this.props.params.namespace)

                script.innerHTML = data
                document.body.appendChild(script);

                this.setState({loading: false})
            });
        })
    }

    render(){
        return (
            this.state.loading ?
            <div className="import-loading-main">
                <x-throbber class="import-throbber"></x-throbber>
                <h4 style={{color: "white"}} className="import-loading-text">Fetching Logs</h4>
            </div> : 
            <div></div>
        )
    }
}
