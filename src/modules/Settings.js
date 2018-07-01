import React, { Component } from 'react';
import { InputNumber, Input, message, Breadcrumb, Layout, Button } from 'antd';
import _ from 'lodash';
import './../App.css';
const { Header, Content, Sider } = Layout;

class Settings extends Component {

  state = {
    apiKey: "",
    apiSecret: "",
  }

  constructor(props){
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onUpdateKey = this.onUpdateKey.bind(this);
  }

  componentWillMount() {
    this.setState({
      apiKey: localStorage.getItem("binance-key"),
      apiSecret: localStorage.getItem("binance-secret"),
    })
  }

  onSave() {
    localStorage.setItem("binance-key", this.state.apiKey);
    localStorage.setItem("binance-secret", this.state.apiSecret);
    message.success(localStorage.getItem("binance-key"));
  }

  onUpdateKey = e =>
    this.setState({
      apiKey: e.target.value,
  });

  onUpdateSecret = e =>
    this.setState({
      apiSecret: e.target.value,
  });

  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: '15px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <h3>Settings</h3>
          <p>You must enter Binance API info for this app to work correctly</p>
          <Input
            value={this.state.apiKey}
            onChange={this.onUpdateKey}
            placeholder="Binance API Key"
          />
          <Input
            value={this.state.apiSecret}
            onChange={this.onUpdateSecret}
            placeholder="Binance API Secret"
          />
          <Button onClick={this.onSave}>Save</Button>
        </Content>
      </div>
    );
  }
}

export default Settings;
