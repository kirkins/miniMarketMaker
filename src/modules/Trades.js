import React, { Component } from 'react';
import { Collapse, Layout, Tabs, Icon} from 'antd';
import SwingTrade from "./SwingTrade"
import './Trades.css';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
let activeTrade;

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
        <Layout style={{height:"100vh"}}>
          <Tabs
            defaultActiveKey="0"
            tabPosition="left"
            style={{height:"100vh"}}
          >
              {this.state.trades.map(function(name, index){
                return <TabPane style={{height:"100vh"}} tab={<span><Icon type="stock" />Trade {index+1}</span>} key={index}>
                         <SwingTrade class="swingTrade"/>
                       </TabPane>
              })}
          </Tabs>
          <a href="#" onClick={this.addTrade}>Add</a>
        </Layout>
    )
  }

}

export default Trades;
