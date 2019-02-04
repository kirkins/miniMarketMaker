import React, { Component } from 'react';
import { Button, Collapse, Layout, Tabs, Icon, message } from 'antd';
import SwingTrade from "./FishTrade"
import './Trades.css';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
let activeTrade;

class Trades extends Component {

  constructor(props) {
    super(props);
    this.newTabIndex = 2;
    const panes = [
      { title: 'Trade 1', content: <SwingTrade/>, key: 'Trade 1' },
    ];
    this.state = {
      activeKey: panes[0].key,
      panes,
    };
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  add = () => {
    const panes = this.state.panes;
    const activeKey = `Trade ${this.newTabIndex++}`;
    panes.push({ title: activeKey, content: <SwingTrade/>, key: activeKey });
    this.setState({ panes, activeKey });
  }

  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });

  }

  render() {
    return (
      <div>
        <Tabs
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          tabPosition='left'
        >
          {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
        </Tabs>
      </div>
    )
  }

}

export default Trades;
