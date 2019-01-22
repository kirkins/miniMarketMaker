import React, { Component } from 'react';
import Binance from 'binance-api-node';
import _ from 'lodash';
import './../App.css';
import { Row, Col, Switch, Layout, Menu, Icon, AutoComplete, Input, Button, Timeline, Divider, message } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
let eventLoop
let binance

class SwingTrade extends Component {

  state = {
    orderHistory: [],
    pairs: [],
    filteredPairs: null,
    selectedPair: "",
    marketPrice: 0,
    buyPrice: 0,
    sellPrice: 0,
    quantity: 100,
    buy: false,
    lastOrder: "",
  }

  constructor(props){
    super(props);
    this.onSelectPair = this.onSelectPair.bind(this);
    this.makeTrade = this.makeTrade.bind(this);
    this.onFilterPair = this.onFilterPair.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.changeBuy = this.changeBuy.bind(this);
    this.changeBuyPrice = this.changeBuyPrice.bind(this);
    this.changeSellPrice = this.changeSellPrice.bind(this);
    this.checkOrder = this.checkOrder.bind(this);
    this.checkPrice = this.checkPrice.bind(this);
  }

  componentWillMount() {
    if(!localStorage.getItem("binance-key") 
        || localStorage.getItem === ""
        || !localStorage.getItem("binance-secret")
        || localStorage.getItem === "") {
      this.props.history.push('/settings')
    } else {
      const APIKEY = localStorage.getItem("binance-key");
      const APISECRET = localStorage.getItem("binance-secret");
      binance = Binance({apiKey: APIKEY, apiSecret: APISECRET, test: true})
      let comp = this
      binance.exchangeInfo().then(results => {
        var symbols = _.map(results.symbols, 'symbol')
        comp.setState({pairs: symbols, filteredPairs: symbols})
      }).catch(function (error) {
        console.log(error)
      })
    }
  }

  onFilterPair(value) {
    this.setState({filteredPairs: _.filter(this.state.pairs, function(pair) {
        return pair.indexOf(value.toUpperCase()) >= 0;
    })})
  }

  onSelectPair(pair) {
    let comp = this
    this.setState({selectedPair: pair})
    binance.prices().then(results => {
      let priceNow = results[pair]
      let sell = priceNow
      comp.setState({selectedPair: pair, marketPrice: priceNow, buyPrice: priceNow, sellPrice: sell})
      setTimeout(function() {
        comp.checkPrice()
      })
    })
  }

  changeSellPrice = e =>
    this.setState({
      sellPrice: e.target.value,
  });

  changeBuyPrice = e =>
    this.setState({
      buyPrice: e.target.value,
  });

  changeQuantity = e =>
    this.setState({
      quantity: e.target.value,
  });

  changeBuy() {
    this.setState({ buy: !this.state.buy})
  }

  makeTrade() {
    let comp = this
    let side = this.state.buy ? "BUY" : "SELL"
    let price = this.state.buy ? this.state.buyPrice : this.state.sellPrice
    let messageText = side + " " + this.state.quantity + " " + this.state.selectedPair + " for " + price
    message.info(messageText)
    binance.order({
      symbol: this.state.selectedPair,
      side: side,
      quantity: this.state.quantity,
      price: price,
    }).then(results => {
      message.success(JSON.stringify(results))
      let newOrdersArray = this.state.orderHistory
      newOrdersArray.push(results)
      this.setState({orderHistory: newOrdersArray, lastOrder: results.orderId})
      eventLoop = setInterval(function() {
        comp.checkOrder()
      }, 5000);
    }).catch(function (error) {
      message.error(JSON.stringify(error))
    })
  }

  checkOrder() {
    binance.getOrder({
      symbol: this.state.selectedPair,
      orderId: this.state.lastOrder,
    }).then(results => {
      if(results.status==="FILLED") {
        clearInterval(eventLoop)
        this.changeBuy()
        this.makeTrade()
      }
    }).catch(function (error) {
      message.error(JSON.stringify(error))
    })
  }

  checkPrice() {
    let comp = this
    binance.prices().then(results => {
      let color = null
      let priceNow = results[this.state.selectedPair]
      if(priceNow>this.state.marketPrice) {
        color = "green"
      } else if(priceNow<this.state.marketPrice) {
        color = "red"
      }
      comp.setState({marketPrice: priceNow, priceColor: color})
    })
    setTimeout(function() {
      comp.checkPrice()
    }, 5000)
  }

  render() {
    return (
      <div>
        <Content class="trade-container"> 
          <h3>Create Swing Trade</h3>
          <p>symbol: { this.state.selectedPair }</p>
          <p>price: <span className={this.state.priceColor}>{ this.state.marketPrice }</span></p>
          <Row>
            <AutoComplete
              dataSource={this.state.filteredPairs}
              placeholder='trading pair'
              onSelect={this.onSelectPair}
              onSearch={this.onFilterPair}
            />
            <Input
              value={this.state.quantity}
              onChange={this.changeQuantity}
              placeholder='Quantity'
            />
            <Input
              value={this.state.buyPrice}
              onChange={this.changeBuyPrice}
              placeholder='Buy price'
            />
            <Input
              value={this.state.sellPrice}
              onChange={this.changeSellPrice}
              placeholder='Sell price'
            />
            <Switch defaultChecked
              checked={this.state.buy}
              onChange={this.changeBuy}
            />
            <label>{this.state.buy ? "Buy" : "Sell"}</label>
          </Row>
          <Row>
            <Button
              type='primary'
              onClick={this.makeTrade}
            >
              Start
            </Button>
          </Row>
          <Divider/>
          <Timeline>
            {
              this.state.orderHistory.map((order) => {
                return <Timeline.Item color={order.side==="BUY" ? "green" : "red"}>
                         Order #{order.orderId} {order.side} {order.symbol} {order.origQty} for {order.price}
                       </Timeline.Item>
              })
            }
          </Timeline>
        </Content>
      </div>
    );
  }
}

export default SwingTrade;
