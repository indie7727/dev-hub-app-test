import React, { Component } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import {getDateStringFromObj} from '../../utils/time'

export default class UserDetail extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        values: {}
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
      var values = this.state.values
      Object.keys(contributions).forEach((key) => {
        values[key] = contributions[key].value
      })
      this.setState({values: values})
    })
  }

  componentWillUnmount(){
      console.log('Unmount')
      this.unsubscribe()
  }

  render() {
    var today = getDateStringFromObj(new Date(), 0);
    var lastYearDate = getDateStringFromObj(new Date(), 365);
    var values = [];
    Object.keys(this.state.values).forEach((key) => {
        values.push({
            "date": key,
            "count": this.state.values[key]
        })
    })
    return (
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
    )
  }
}
