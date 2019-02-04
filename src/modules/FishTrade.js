import React, { Component } from 'react';
import Binance from 'binance-api-node';
import _ from 'lodash';
import './SwingTrade.css';
import { Layout, Form, Switch, AutoComplete, Input, Button, Timeline, message, Row, Col} from 'antd';
let eventLoop
let binance

const {
  Header, Footer, Sider, Content,
} = Layout;

class SwingTrade extends Component {

  state = {
    orderHistory: [],
    pairs: [],
    filteredPairs: null,
    selectedPair: "",
    marketPrice: 0,
    buyPrice: 0,
    quantity: 100,
    on: false,
    lastOrder: "",
  }

  constructor(props){
    super(props);
    this.onSelectPair = this.onSelectPair.bind(this);
    this.onFilterPair = this.onFilterPair.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.changeBuyPrice = this.changeBuyPrice.bind(this);
    this.checkPrice = this.checkPrice.bind(this);
    this.makeTrade = this.makeTrade.bind(this);
    this.buyNow = this.buyNow.bind(this);
  }

  componentWillMount() {
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

  componentWillUnmount() {
    clearInterval(eventLoop);
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

  makeTrade() {
    let comp = this
    this.state.on = true;
    eventLoop = setInterval(function() {
      comp.checkPrice()
    }, 5000);
  }

  buyNow() {
    binance.order({
      symbol: this.state.selectedPair,
      side: "BUY",
      quantity: this.state.quantity,
      price: this.state.buyPrice,
    }).then(results => {
      console.log(JSON.stringify(results))
      clearInterval(eventLoop);
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
      if(priceNow < this.state.buyPrice) this.buyNow();
    })
    setTimeout(function() {
      comp.checkPrice()
    }, 5000)
  }

  render() {
    return (
      <Content id="trades-page">
        <Row gutter={16}>
         <Col span={6}>
            <Form class="trade-container" style={{ width: 300 }}>
              <p>symbol: { this.state.selectedPair }</p>
              <p>price: <span className={this.state.priceColor}>{ this.state.marketPrice }</span></p>
              <Form.Item label="trading pair">
                <AutoComplete
                  dataSource={this.state.filteredPairs}
                  placeholder='trading pair'
                  onSelect={this.onSelectPair}
                  onSearch={this.onFilterPair}
                  disabled={this.state.lastOrder!=""}
                />
              </Form.Item>
              <Form.Item label="quantity">
                <Input
                  value={this.state.quantity}
                  onChange={this.changeQuantity}
                  placeholder='Quantity'
                  disabled={this.state.lastOrder!=""}
                />
              </Form.Item>
              <Form.Item label="buy price">
                <Input
                  value={this.state.buyPrice}
                  onChange={this.changeBuyPrice}
                  placeholder='Buy price'
                  disabled={this.state.lastOrder!=""}
                />
              </Form.Item>
              <Button
                type='primary'
                disabled={this.state.lastOrder!=""}
                onClick={this.makeTrade}
              >
                Fish
              </Button>
            </Form>
          </Col>
          <Col span={9}>
            <p>place holder</p>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default SwingTrade;
