import React, { Component } from 'react';
import { Collapse } from 'antd';
import SwingTrade from "./SwingTrade"

const Panel = Collapse.Panel;

class Trades extends Component {

  state = {
    trades: ["test"],
  }

  constructor(props){
    super(props);
    this.addTrade = this.addTrade.bind(this);
  }

  addTrade() {
    this.setState({ trades: this.state.trades.concat("new")})
  }

  render() {
    return (
      <div>
        {this.state.trades.map(function(name, index){
          return <Collapse key={[index]}>
                   <Panel header={"Trade #"+(index+1)} key={index}>
                     <SwingTrade/>
                   </Panel>
                 </Collapse>
        })}
        <a href="#" onClick={this.addTrade}>Add</a>
      </div>
    )
  }

}

export default Trades;
