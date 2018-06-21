import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import { Row, Col, Layout, Menu, Breadcrumb, Icon, AutoComplete, InputNumber, Button, Timeline, Slider, Divider, message } from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'
import SwingTrade from "./modules/SwingTrade"
import Settings from "./modules/Settings"
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
let eventLoop

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1"><Link to="/swing">Trade</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/settings">Settings</Link></Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <SubMenu key="sub1" title={<span>Active Trades</span>}>
                  <Menu.Item key="1">Trade #1</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Route path="/swing" component={SwingTrade}/>
              <Route path="/settings" component={Settings}/>
            </Layout>
          </Layout>
        </Layout>
      </div>
      </Router>
    );
  }
}

export default App;
