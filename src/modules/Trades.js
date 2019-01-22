import React, { Component } from 'react';
import { Collapse, Layout, Menu } from 'antd';
import SwingTrade from "./SwingTrade"
import './Trades.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const Panel = Collapse.Panel;

class Trades extends Component {

  state = {
    trades: [{}],
    displayedTrade: 0,
  }

  constructor(props){
    super(props);
    this.addTrade = this.addTrade.bind(this);
  }

  addTrade() {
    this.setState({ trades: this.state.trades.concat({})})
  }

  render() {
    return (
      <div>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="sub1" title={<span>Active Trades</span>}>
                {this.state.trades.map(function(name, index){
                  return <Menu.Item key={index}>Trade #{index}</Menu.Item>
                })}
              </SubMenu>
            </Menu>
          </Sider>
          {this.state.trades.map(function(name, index){
            return <div>
                     <SwingTrade/> 
                   </div>
          })}
          <a href="#" onClick={this.addTrade}>Add</a>
        </Layout>
      </div>
    )
  }

}

export default Trades;
