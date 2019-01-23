import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import { Layout, Menu } from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'
import Trades from "./modules/Trades"
import Settings from "./modules/Settings"
const { Header, Content } = Layout;
let eventLoop

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {height: props.height};
  }

  componentWillMount(){
    this.setState({height: window.innerHeight});
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Layout style={{height:"100vh"}}>
            <Header className="header">
              <div className="logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1"><Link to="/trades">Trades</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/settings">Settings</Link></Menu.Item>
              </Menu>
            </Header>
            <Layout style={{ padding: '0 24px 24px', height:"100vh"}}>
              <Route path="/trades" component={Trades}/>
              <Route path="/settings" component={Settings}/>
            </Layout>
          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
