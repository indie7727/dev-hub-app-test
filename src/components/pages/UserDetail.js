import React, { Component } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import {getDateStringFromObj} from '../../utils/time'
import { Doughnut, Line } from 'react-chartjs-2';
import { wsideUrl } from '../../constants';
import Collapsible from 'react-collapsible';

export default class UserDetail extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        values: {},
        wside: null,
        bhive: null,
        wsideTime: "today",
        bhiveTime: "lastWeek",
        loading: true
    }
    for(var i=0;i<=365;i++){
        this.state.values[getDateStringFromObj(new Date(), i)] = 0
    }   
  }

  componentDidMount(){
    const db = firebase.firestore();
    this.unsubscribe = db.collection("users").doc(this.props.auth.getProfile().nickname).onSnapshot((doc) => {
      if(!doc.data())
        return
      var contributions = doc.data().contributions;

      if(contributions){
        var values = this.state.values
        Object.keys(contributions).forEach((key) => {
          values[key] = contributions[key].value
        })
        this.setState({values: values})
      }
      this.setState({wside: doc.data().wside})
      this.setState({bhive: doc.data().bhive})
      this.setState({loading: false})
    })
  }

  componentWillUnmount(){
      this.unsubscribe()
  }

  handleWsideTabChange(value){
    this.setState({wsideTime: value})
  }

  handleBhiveTabChange(value){
    this.setState({bhiveTime: value})
  }

  getValueFromTime(timeString){
    var splitString = timeString.split(":")
    return splitString[0] * 3600 + splitString[1] * 60 + splitString[2] * 1
  }

  getTimeFromValue(seconds){
    var d = Number(seconds);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    return hDisplay + mDisplay; 
  }
  
  onboardCodealike(){
    firebase.firestore().collection("users").doc(this.props.auth.getProfile().nickname).set({
      wside: {
        userName: this.refs.codealikeUsername.value,
        password: this.refs.codealikePassword.value,
      }
    }, {merge: true})

    fetch(wsideUrl,
      {
          method: "POST",
          body: JSON.stringify({
            userId: this.props.auth.getProfile().nickname,
            userName: this.refs.codealikeUsername.value,
            password: this.refs.codealikePassword.value,
          })
      })
  }

  onboardBhive(){
    firebase.firestore().collection("users").doc(this.props.auth.getProfile().nickname).set({
      bhive: {
        enabled: true,
        lastWeek: {
          arson: "45",
          cleanCode: "324",
          decay: "126" 
        }
      }
    }, {merge: true})
  }

  render() {
    if(this.state.loading)
      return <div className="user-detail-loading-main">
        <x-throbber class="user-detail-loading-throbber"></x-throbber>
        <h4 className="user-detail-loading-text">Fetching your data ...</h4>
      </div>

    var today = getDateStringFromObj(new Date(), 0);
    var lastYearDate = getDateStringFromObj(new Date(), 365);
    var values = [];
    Object.keys(this.state.values).forEach((key) => {
        values.push({
            "date": key,
            "count": this.state.values[key]
        })
    })

    var timeData = null;
    if(this.state.wside)
      timeData = this.state.wside[this.state.wsideTime]

    var bhiveData = null;
    if(this.state.bhive)
      bhiveData = this.state.bhive[this.state.bhiveTime]
      
    return (
      <div className="user-detail-main">
        <div className="user-detail-contribution-chart">
            <h5 className="user-detail-contributions-title">
                Contributions
            </h5>
            <CalendarHeatmap
                startDate={new Date(lastYearDate)}
                endDate={new Date(today)}
                values={values}
                classForValue={(value) => {
                    if (!value)
                      return 'color-empty';
                    return `color-scale-${value.count}`;
                }}
                showWeekdayLabels={true}
                tooltipDataAttrs={value => {
                    return {'data-tip': `
                        <span style="font-weight: 600;"> ${value.count} value points added </span> 
                        <span style="font-weight: 400;"> on ${new Date(Date.parse(value.date)).toDateString().replace(/^\S+\s/,'')}<span>
                    `};
                }}
            />
            <ReactTooltip html={true} />
        </div>
        {this.state.wside ? (
          <div className='user-detail-codealike-main'>
            {this.state.wside[this.state.wsideTime] ? 
              <div className="user-detail-codealike-time">
                <div className="user-detail-codealike-time-header">
                  <div className="user-detail-addon-title">
                    WorkSmart IDE
                  </div>
                  <x-tabs class="user-detail-codealike-time-tabs" centered>
                    <x-tab 
                      class="user-detail-codealike-time-tab" 
                      onClick={this.handleWsideTabChange.bind(this, "today")} 
                      selected
                    >
                      <x-label>Today</x-label>
                    </x-tab>

                    <x-tab 
                      class="user-detail-codealike-time-tab" 
                      onClick={this.handleWsideTabChange.bind(this, "week")}
                    >
                      <x-label>This Week</x-label>
                    </x-tab>

                    <x-tab 
                      class="user-detail-codealike-time-tab" 
                      onClick={this.handleWsideTabChange.bind(this, "month")}
                    >
                      <x-label>This Month</x-label>
                    </x-tab>
                  </x-tabs>
                </div>
                <div className="user-detail-addon-badges">
                  <div className="user-detail-addon-badge" style={{background: "#5fca5fa1"}}>
                    <div className="user-detail-addon-badge-title">Time Logged</div>
                    <div className="user-detail-addon-badge-value">{timeData.timeTracked}</div>
                  </div>
                  <a className="user-detail-addon-badge" href="http://wside.crossover.com/behavior">
                    <div className="user-detail-addon-badge-title">Interruptions</div>
                    <div className="user-detail-addon-badge-value">{timeData.interruptions}</div>
                  </a>
                  <div className="user-detail-addon-badge">
                    <div className="user-detail-addon-badge-title">Context Switches</div>
                    <div className="user-detail-addon-badge-value">{timeData.contextSwitches}</div>
                  </div>
                </div>
                <div className="user-detail-codealike-time-content">
                  <div className="user-detail-codealike-time-doughnut-1">
                    <Doughnut
                      data={{
                        labels: ['Coding', 'Debugging', 'System', 'Building', 'Web Navigation'],
                        datasets: [{ 
                          data: [
                            this.getValueFromTime(timeData.timeSplit.codingTime),
                            this.getValueFromTime(timeData.timeSplit.debuggingTime),
                            this.getValueFromTime(timeData.timeSplit.systemTime),
                            this.getValueFromTime(timeData.timeSplit.buildingTime),
                            this.getValueFromTime(timeData.timeSplit.webNavigationTime)
                          ],
                          backgroundColor: [
                            '#38a260',
                            '#36A2EB',
                            '#FFCE56',
                            '#a983e0',
                            "#be2787",
                          ],
                          borderWidth: 0.4
                        }]
                      }}

                      legend={{
                        display: true,
                        position: 'left',
                        fullWidth: true,
                        reverse: false,
                        labels: {
                          fontColor: 'black'
                        }
                      }}
                      options={{
                        cutoutPercentage: 75,
                        tooltips: {
                          callbacks: {
                            label: (tooltipItem, chartData) => {
                              return chartData.labels[tooltipItem.index] + ': ' + this.getTimeFromValue(chartData.datasets[0].data[tooltipItem.index]);
                            }
                          }
                        }
                      }}
                    />
                    <div className="user-detail-codealike-time-doughnut-inner-1">
                      <span>Activity</span>
                    </div>
                  </div>
                  <div className="user-detail-codealike-time-doughnut-2">
                    <Doughnut
                      data={{
                        labels: Object.keys(timeData.projectsTimeSplit).map((key) => {
                          if(key.length > 21)
                            return key.slice(0,18) + "..."
                          else
                            return key
                        }),
                        datasets: [{ 
                          data: Object.keys(timeData.projectsTimeSplit).map((key) =>
                            this.getValueFromTime(timeData.projectsTimeSplit[key])),
                          backgroundColor: [
                            '#38a260',
                            '#36A2EB',
                            '#FFCE56',
                            '#a983e0',
                            "#be2787",
                            "#da4040",
                            '#FF6384',
                            "#4343de",

                            '#38a260',
                            '#36A2EB',
                            '#FFCE56',
                            '#a983e0',
                            "#be2787",
                            "#da4040",
                            '#FF6384',
                            "#4343de",
                          ],
                          borderWidth: 0.4
                        }]
                      }}

                      legend={{
                        display: true,
                        position: 'left',
                        fullWidth: true,
                        reverse: false,
                        labels: {
                          fontColor: 'black'
                        }
                      }}
                      options={{
                        cutoutPercentage: 75,
                        tooltips: {
                          callbacks: {
                            label: (tooltipItem, chartData) => {
                              var originalLabels = Object.keys(timeData.projectsTimeSplit).map((key) => key)
                              return originalLabels[tooltipItem.index] + ': ' + this.getTimeFromValue(chartData.datasets[0].data[tooltipItem.index]);
                            }
                          }
                        },
                      }}
                    />
                    <div className="user-detail-codealike-time-doughnut-inner-2">
                      <span>Projects</span>
                    </div>
                  </div>
                </div>
              </div> : 
              <div className="user-detail-addon-loading-main">
                <x-throbber class="user-detail-addon-loading-throbber"></x-throbber>
                <h4 className="user-detail-addon-loading-text">Fetching WorkSmart IDE data ...</h4>
              </div>
            }
        </div> ) : 
          <div className='user-detail-addon-import-main'>
            <div className='user-detail-addon-import-form'>
              <div className="user-detail-addon-import-form-title">
                WorkSmart IDE
              </div>
              <label>Username</label>
              <input 
                ref="codealikeUsername"
                className="user-detail-codealike-username"
                type="text"
                defaultValue={this.state.codealikeUsername}
              />
              <label>Password</label>
              <input 
                ref="codealikePassword"
                className="user-detail-codealike-password"
                type="password"
                defaultValue={this.state.codealikePassword}
              />
              <button 
                onClick={this.onboardCodealike.bind(this)}
                className="user-detail-addon-button btn btn-prev btn-primary btn-lg pull-right"
              >
                Submit
              </button>
            </div>
            <div className="user-detail-addon-import-text-main">
              <div className="user-detail-addon-import-text"> Track and analyze your time using WS-IDE </div>
              <div className="user-detail-addon-import-sub-text"> Don't have an account? Sign up&nbsp;
                <a href="http://wside.crossover.com/" target="_blank" style={{color: "blue", textDecoration: "underline"}}>here</a>
              </div>
            </div>
          </div>
        }
        {this.state.bhive ? (
          <div className='user-detail-bhive-main'>
            {this.state.bhive[this.state.bhiveTime] ? 
              <div className="user-detail-bhive-imported">
                <div className="user-detail-codealike-time-header">
                  <div className="user-detail-addon-title">
                    B-Hive
                  </div>
                  <x-tabs class="user-detail-codealike-time-tabs" centered>
                    <x-tab 
                      class="user-detail-codealike-time-tab" 
                      onClick={this.handleBhiveTabChange.bind(this, "lastWeek")}
                      selected
                    >
                      <x-label>Past Week</x-label>
                    </x-tab>
                    <x-tab 
                      class="user-detail-codealike-time-tab" 
                      onClick={this.handleBhiveTabChange.bind(this, "lastMonth")}
                    >
                      <x-label>Past 4 weeks</x-label>
                    </x-tab>
                  </x-tabs>
                </div>
                <div className="user-detail-addon-badges">
                  <div className="user-detail-addon-badge">
                    <div className="user-detail-addon-badge-title">Arson</div>
                    <div className="user-detail-addon-badge-value">{bhiveData.arson} LOC</div>
                  </div>
                  <div className="user-detail-addon-badge" style={{background: "rgba(230, 159, 62, 0.82)"}}>
                    <div className="user-detail-addon-badge-title">Decay</div>
                    <div className="user-detail-addon-badge-value">{bhiveData.decay} LOC</div>
                  </div>
                  <div className="user-detail-addon-badge" style={{background: "#5fca5fa1"}}>
                    <div className="user-detail-addon-badge-title">Clean Code</div>
                    <div className="user-detail-addon-badge-value">{bhiveData.cleanCode} LOC</div>
                  </div>
                </div>
                <div className="user-detail-bhive-issue-data">
                  <Collapsible 
                    trigger={
                      <div className="user-detail-bhive-issue-data-collapsible-main">
                        <span>3e464f3 - Added better examples</span>
                        <div style={{alignSelf: "flex-end", display: "flex"}}> 
                          <div className="user-detail-bhive-issue-data-collapsible-badges">
                            <span className="user-detail-bhive-issue-data-collapsible-loc">
                              105 LOC
                            </span>
                            <span className="user-detail-bhive-issue-data-collapsible-arson">
                              12%
                            </span>
                            <span className="user-detail-bhive-issue-data-collapsible-decay">
                              15%
                            </span>
                            <span className="user-detail-bhive-issue-data-collapsible-clean-code">
                              73%
                            </span> 
                          </div>
                          <x-icon class="user-detail-bhive-issue-data-collapsible-arrow" name="keyboard-arrow-down" iconset="node_modules/xel/images/icons.svg"></x-icon>
                        </div>
                      </div>
                    }
                  >
                    <div className="user-detail-bhive-issue-data-collapsible-issue-text">
                      <div style={{display: "flex", flexDirection: "column"}}>
                        <span className="user-detail-bhive-issue-data-collapsible-issue-name">Long Methods</span>
                        <span className="user-detail-bhive-issue-data-collapsible-issue-description">Methods over 100 lines</span>
                      </div>
                      <span className="user-detail-bhive-issue-data-collapsible-issue-file">/src/com/main/Activity/file.java</span>
                      <a className="user-detail-bhive-issue-data-collapsible-issue-link">Link</a>
                    </div>
                  </Collapsible>
                  <Collapsible 
                    trigger={
                      <div className="user-detail-bhive-issue-data-collapsible-main">
                        <span>1ae5ips - Added a readme</span>
                        <div style={{alignSelf: "flex-end", display: "flex"}}> 
                          <div className="user-detail-bhive-issue-data-collapsible-badges">
                            <span className="user-detail-bhive-issue-data-collapsible-loc">
                              5 LOC
                            </span>
                            <span className="user-detail-bhive-issue-data-collapsible-arson">
                              0%
                            </span>
                            <span className="user-detail-bhive-issue-data-collapsible-decay">
                              0%
                            </span>
                            <span className="user-detail-bhive-issue-data-collapsible-clean-code">
                              100%
                            </span> 
                          </div>
                          <x-icon class="user-detail-bhive-issue-data-collapsible-arrow" name="keyboard-arrow-down" iconset="node_modules/xel/images/icons.svg"></x-icon>
                        </div>
                      </div>
                    }
                  >
                    <div className="user-detail-bhive-issue-data-collapsible-issue-text">
                      <div style={{display: "flex", flexDirection: "column"}}>
                        <span className="user-detail-bhive-issue-data-collapsible-issue-name">Long Methods</span>
                        <span className="user-detail-bhive-issue-data-collapsible-issue-description">Methods over 100 lines</span>
                      </div>
                      <span className="user-detail-bhive-issue-data-collapsible-issue-file">/src/com/main/Activity/file.java</span>
                      <a className="user-detail-bhive-issue-data-collapsible-issue-link">Link</a>
                    </div>
                  </Collapsible>
                </div>
                <div className="user-detail-bhive-line-chart">
                  <Line 
                    options={{
                      maintainAspectRatio: false,
                    }}
                    legend={{
                      display: false
                    }}
                    data={{
                      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                      datasets: [
                        {
                          label: 'Arson',
                          fill: false,
                          lineTension: 0.1,
                          backgroundColor: '#ff0000d1',
                          borderColor: '#ff0000d1',
                          borderCapStyle: 'butt',
                          borderDash: [],
                          borderDashOffset: 0.0,
                          borderJoinStyle: 'miter',
                          pointBorderColor: '#ff0000d1',
                          pointBackgroundColor: '#fff',
                          pointBorderWidth: 0.5,
                          pointHoverRadius: 4,
                          pointHoverBackgroundColor: '#ff0000d1',
                          pointHoverBorderColor: '#ff0000d1',
                          pointHoverBorderWidth: 1,
                          pointRadius: 1,
                          pointHitRadius: 10,
                          data: [45, 38, 15, 2]
                        },
                        {
                          label: 'Decay',
                          fill: false,
                          lineTension: 0.1,
                          backgroundColor: 'rgba(230, 159, 62, 0.82)',
                          borderColor: 'rgba(230, 159, 62, 0.82)',
                          borderCapStyle: 'butt',
                          borderDash: [],
                          borderDashOffset: 0.0,
                          borderJoinStyle: 'miter',
                          pointBorderColor: 'rgba(230, 159, 62, 0.82)',
                          pointBackgroundColor: '#fff',
                          pointBorderWidth: 0.5,
                          pointHoverRadius: 4,
                          pointHoverBackgroundColor: 'rgba(230, 159, 62, 0.82)',
                          pointHoverBorderColor: 'rgba(230, 159, 62, 0.82)',
                          pointHoverBorderWidth: 1,
                          pointRadius: 1,
                          pointHitRadius: 10,
                          data: [31, 27, 22, 12]
                        },
                        {
                          label: 'Clean Code',
                          fill: false,
                          lineTension: 0.1,
                          backgroundColor: 'green',
                          borderColor: 'green',
                          borderCapStyle: 'butt',
                          borderDash: [],
                          borderDashOffset: 0.0,
                          borderJoinStyle: 'miter',
                          pointBorderColor: 'green',
                          pointBackgroundColor: '#fff',
                          pointBorderWidth: 0.5,
                          pointHoverRadius: 4,
                          pointHoverBackgroundColor: 'green',
                          pointHoverBorderColor: 'green',
                          pointHoverBorderWidth: 1,
                          pointRadius: 1,
                          pointHitRadius: 10,
                          data: [55, 67, 72, 92]
                        }
                      ]
                    }}
                  />
                </div>
              </div> : 
              <div className="user-detail-addon-loading-main">
                <h4 className="user-detail-addon-loading-text" style={{fontSize: "0.95em"}}>
                  We are onboarding your repos and fetching data from B-Hive. 
                  <br></br>
                  If this is your first time onboarding this could take a few days.
                </h4>
              </div>
            }
        </div> ) : 
          <div className='user-detail-addon-import-main'>
            <div className='user-detail-addon-import-form'>
              <div className="user-detail-addon-import-form-title">
                B-Hive
              </div>
              <button 
                onClick={this.onboardBhive.bind(this)}
                className="user-detail-addon-button btn btn-prev btn-primary btn-lg pull-right"
              >
                Enable
              </button>
            </div>
            <div className="user-detail-addon-import-text-main">
              <div className="user-detail-addon-import-text"> Pinpoint and improve on your bad coding practices </div>
              <div className="user-detail-addon-import-sub-text"> Don't have an account? Sign up&nbsp;
                <a href="https://bhive.devfactory.com/" target="_blank" style={{color: "blue", textDecoration: "underline"}}>here</a>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
