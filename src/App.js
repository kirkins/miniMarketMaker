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

  state = {
    visible: false,
    confirmLoading: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
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
          <Affix offsetTop={10}>
            <Button style={{float: 'right', marginRight: '10px'}} onClick={this.showModal}>
              <Icon type="setting" />Settings
            </Button>
          </Affix>
          <Layout style={{ padding: '0 24px 24px', height:"100vh"}}>
            <Modal
              title="Title"
              visible={this.state.visible}
              onOk={this.handleOk}
              confirmLoading={this.state.confirmLoading}
              onCancel={this.handleCancel}
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
