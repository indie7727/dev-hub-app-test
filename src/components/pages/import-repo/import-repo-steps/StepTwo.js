import React from 'react'

export class StepTwo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stagingEnvVars: props.getStore().stagingEnvVars,
      productionEnvVars: props.getStore().productionEnvVars,
      previewEnvVars: props.getStore().previewEnvVars,
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

  removeInput(env, index){
    if(env == "staging"){
      this.props.updateStore({stagingEnvVars: this.state.stagingEnvVars.filter((_, i) => i !== index)});
      this.setState({
        stagingEnvVars: this.state.stagingEnvVars.filter((_, i) => i !== index)
      });
    } else if(env == "production"){
      this.props.updateStore({productionEnvVars: this.state.productionEnvVars.filter((_, i) => i !== index)});
      this.setState({
        productionEnvVars: this.state.productionEnvVars.filter((_, i) => i !== index)
      });
    } else if(env == "preview"){
      this.props.updateStore({previewEnvVars: this.state.previewEnvVars.filter((_, i) => i !== index)});
      this.setState({
        previewEnvVars: this.state.previewEnvVars.filter((_, i) => i !== index)
      });
    }
  }

  appendInput(env) {
    if(env == "staging"){
      this.props.updateStore({stagingEnvVars: this.state.stagingEnvVars.concat([{key:'', value:''}])});
      this.setState({ 
        stagingEnvVars: this.state.stagingEnvVars.concat([{key:'', value:''}])
      })
    } else if(env == "production"){
      this.props.updateStore({productionEnvVars: this.state.productionEnvVars.concat([{key:'', value:''}])});
      this.setState({ 
        productionEnvVars: this.state.productionEnvVars.concat([{key:'', value:''}])
      })
    } else if(env == "preview"){
      this.props.updateStore({previewEnvVars: this.state.previewEnvVars.concat([{key:'', value:''}])});
      this.setState({ 
        previewEnvVars: this.state.previewEnvVars.concat([{key:'', value:''}])
      })
    }
  }
    

  handleInputChange(event){
    var info = event.target.name.split("-")
    if (info[0] == "staging"){
      this.state.stagingEnvVars[info[1]][info[2]] = event.target.value
      this.props.updateStore({stagingEnvVars: this.state.stagingEnvVars});
      this.setState({stagingEnvVars: this.state.stagingEnvVars})
    } else if (info[0] == "production"){
      this.state.productionEnvVars[info[1]][info[2]] = event.target.value
      this.props.updateStore({productionEnvVars: this.state.productionEnvVars});
      this.setState({productionEnvVars: this.state.productionEnvVars})
    } else if (info[0] == "preview"){
      this.state.previewEnvVars[info[1]][info[2]] = event.target.value
      this.props.updateStore({previewEnvVars: this.state.previewEnvVars});
      this.setState({previewEnvVars: this.state.previewEnvVars})
    }
  }
  render () {
    return (
      <div className="env-vars-main">
        <div className="staging-env-vars">
          <div style={{display: "flex", justifyContent: "center"}}>
            <label>Staging Environment Variables<span className="aux"></span></label>
            <x-icon 
              class="env-vars-add-button" 
              onClick={ () => this.appendInput("staging")} 
              name="add" 
              iconset="node_modules/xel/images/icons.svg">
            </x-icon>
          </div>
          <div id="dynamicInput">
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.stagingEnvVars.map((data, index) => 
                <input 
                  name={"staging-" + index + "-key"}
                  value={data.key}
                  onChange={this.handleInputChange.bind(this)}
                  className="env-input-box-key"
                  placeholder='Key'
                />
              )}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.stagingEnvVars.map((dict, index) =>
                <input 
                  name={"staging-" + index + "-value"}
                  value={this.state.stagingEnvVars[index].value} 
                  onChange={this.handleInputChange.bind(this)}
                  className="env-input-box-value"
                  placeholder='Value'
                />
              )}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.stagingEnvVars.map((dict, index) =>
                <x-icon 
                  class="env-vars-remove-button" 
                  onClick={ () => this.removeInput("staging", index)} 
                  name="clear" 
                  iconset="node_modules/xel/images/icons.svg">
                </x-icon>
              )}
            </div>
          </div>
        </div>
        
        <div className="production-env-vars">
          <div style={{display: "flex", justifyContent: "center"}}>
            <label>Production Environment Variables<span className="aux"></span></label>
            <x-icon 
              class="env-vars-add-button" 
              onClick={ () => this.appendInput("production")} 
              name="add" 
              iconset="node_modules/xel/images/icons.svg">
            </x-icon>
          </div>
          <div id="dynamicInput">
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.productionEnvVars.map((dict, index) => 
                <input 
                  name={"production-" + index + "-key"}
                  value={this.state.productionEnvVars[index].key}
                  onChange={this.handleInputChange.bind(this)}
                  className="env-input-box-key"
                  placeholder='Key'
                />
              )}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.productionEnvVars.map((dict, index) =>
                <input 
                  name={"production-" + index + "-value"}
                  value={this.state.productionEnvVars[index].value} 
                  onChange={this.handleInputChange.bind(this)}
                  className="env-input-box-value"
                  placeholder='Value'
                />
              )}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.productionEnvVars.map((dict, index) =>
                <x-icon 
                  class="env-vars-remove-button" 
                  onClick={ () => this.removeInput("production", index)} 
                  name="clear" 
                  iconset="node_modules/xel/images/icons.svg">
                </x-icon>
              )}
            </div>
          </div>
        </div>
        
        <div className="preview-env-vars">
          <div style={{display: "flex", justifyContent: "center"}}>
            <label>Preview Environment Variables<span className="aux"></span></label>
            <x-icon 
              class="env-vars-add-button" 
              onClick={ () => this.appendInput("preview")} 
              name="add" 
              conset="node_modules/xel/images/icons.svg">
            </x-icon>
          </div>
          <div id="dynamicInput">
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.previewEnvVars.map((dict, index) => 
                <input 
                  name={"preview-" + index + "-key"}
                  value={this.state.previewEnvVars[index].key}
                  onChange={this.handleInputChange.bind(this)}
                  className="env-input-box-key"
                  placeholder='Key'
                />
              )}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.previewEnvVars.map((dict, index) =>
                <input 
                  name={"preview-" + index + "-value"}
                  value={this.state.previewEnvVars[index].value} 
                  onChange={this.handleInputChange.bind(this)}
                  className="env-input-box-value"
                  placeholder='Value'
                />
              )}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
              {this.state.previewEnvVars.map((dict, index) =>
                <x-icon 
                  class="env-vars-remove-button" 
                  onClick={ () => this.removeInput("preview", index)} 
                  name="clear" 
                  iconset="node_modules/xel/images/icons.svg">
                </x-icon>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}