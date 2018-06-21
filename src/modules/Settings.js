import React, { Component } from 'react';
import { Input, message, Breadcrumb, Layout } from 'antd';
import _ from 'lodash';
import './../App.css';
const { Header, Content, Sider } = Layout;

class Settings extends Component {

  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: '15px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <h3>Settings</h3>
          <Input placeholder="API KEY" />
          <Input placeholder="API Secret" />
        </Content>
      </div>
    );
  }
}

export default Settings;
