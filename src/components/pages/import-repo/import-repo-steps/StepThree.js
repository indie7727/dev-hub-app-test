import React from 'react'

export class StepThree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      portMapping: props.getStore().portMapping
    };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  isValidated() {
    return true;
  }

  validationCheck() {
    return;
  }

  removeInput(index){
    this.props.updateStore({portMapping: this.state.portMapping.filter((_, i) => i !== index)});
    this.setState({
      portMapping: this.state.portMapping.filter((_, i) => i !== index)
    });
  }

  appendInput() {
    this.props.updateStore({portMapping: this.state.portMapping.concat([{port:'', protocol:'HTTP', public: true, url: ""}])});
    this.setState({ 
      portMapping: this.state.portMapping.concat([{port:'', protocol:'HTTP', public: true, url: ""}])
    })
  }

  handleInputChange(event){
    var info = event.target.name.split("-") // index-key
    this.state.portMapping[info[0]][info[1]] = event.target.value
    this.props.updateStore({portMapping: this.state.portMapping});
    this.setState({portMapping: this.state.portMapping})
  }
  
  render () {
    return (
      <div className="port-mapping-main">
        <div style={{display: "flex", justifyContent: "center"}}>
          <label>Ports to Expose<span className="aux"></span></label>
          <x-icon 
            class="port-mapping-add-button" 
            onClick={ () => this.appendInput()} 
            name="add" 
            iconset="node_modules/xel/images/icons.svg">
          </x-icon>
        </div>
        <div id="dynamicInput">
          <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.portMapping.map((data, index) => 
              <input 
                name={index + "-port"}
                type="number"
                value={data.port}
                onChange={this.handleInputChange.bind(this)}
                className="port-mapping-input-box-port"
                placeholder="8000"
              />
            )}
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.portMapping.map((data, index) =>
              <div className="port-mapping-text-https">https://</div>
            )}
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.portMapping.map((data, index) =>
              <input 
                name={index + "-url"}
                value={data.url} 
                onChange={this.handleInputChange.bind(this)}
                className="port-mapping-input-box-url"
                placeholder='Url'
              />
            )}
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.portMapping.map((data, index) =>
              <div className="port-mapping-text-domain">.k8.devfactory.com</div>
            )}
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.portMapping.map((data, index) =>
              <x-icon 
                class="port-mapping-remove-button" 
                onClick={ () => this.removeInput(index)} 
                name="clear" 
                iconset="node_modules/xel/images/icons.svg">
              </x-icon>
            )}
          </div>
        </div>
      </div>
    )
  }
}