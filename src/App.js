import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import { Icon, Affix, Modal, Button, Layout, Menu } from 'antd';
import Trades from "./modules/Trades"
import Settings from "./modules/Settings"
const { Header, Content } = Layout;
let eventLoop

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if(!localStorage.getItem("binance-key")
        || localStorage.getItem === ""
        || !localStorage.getItem("binance-secret")
        || localStorage.getItem === "") {
      this.showModal();
    }
  }

  state = {
    visible: false,
    confirmLoading: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div className="App">
        <Layout style={{height:"100vh"}}>
          <Affix style={{width: '100px', right: '30px', position: 'absolute'}} offsetTop={10}>
            <Button onClick={this.showModal}>
              <Icon type="setting" />Settings
            </Button>
          </Affix>
          <Layout style={{ padding: '0 24px 24px', height:"100vh"}}>
            <Modal
              title="Settings"
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onOk={this.handleCancel}
            >
              <Settings/>
            </Modal>
            <Trades/>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
