import React, { Component } from 'react';
import Binance from 'binance-api-node';
import _ from 'lodash';
import './App.css';
import { Row, Col, Switch, Layout, Menu, Breadcrumb, Icon, AutoComplete, InputNumber, Button, Timeline, Slider, Divider, message } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const APIKEY = '3oZbp22V7ktr483VQxnoS5Q5NkoCHWEqf011et3lhTahMNrEmJTr279tylNboPPz'
const APISECRET = 'PhsXj5iVNgaxRwLDzYuCHmianQKnHau9mdSdNmuVYbBR9hJcvZ2JkUSUAnlAuPRL'
const binance = Binance({apiKey: APIKEY, apiSecret: APISECRET, test: true})
let eventLoop

class App extends Component {

  state = {
    orderHistory: [],
    pairs: [],
    filteredPairs: null,
    selectedPair: "",
    marketPrice: 0,
    buyPrice: 0,
    sellPrice: 0,
    profitPercent: 0.004,
    quantity: 100,
    buy: false,
    lastOrder: "",
  }

  constructor(props){
      super(props);
      this.onSelectPair = this.onSelectPair.bind(this);
      this.makeTrade = this.makeTrade.bind(this);
      this.onFilterPair = this.onFilterPair.bind(this);
      this.profitPercentChange = this.profitPercentChange.bind(this);
      this.changeQuantity = this.changeQuantity.bind(this);
      this.changeBuy = this.changeBuy.bind(this);
      this.changeBuyPrice = this.changeBuyPrice.bind(this);
      this.changeSellPrice = this.changeSellPrice.bind(this);
      this.checkOrder = this.checkOrder.bind(this);
      this.checkPrice = this.checkPrice.bind(this);
  }

  componentWillMount() {
    let comp = this
    binance.exchangeInfo().then(results => {
      var symbols = _.map(results.symbols, 'symbol')
      comp.setState({pairs: symbols, filteredPairs: symbols})
    }).catch(function (error) {
      console.log(error)
    })
  }

  onFilterPair(value) {
    this.setState({filteredPairs: _.filter(this.state.pairs, function(pair) {
        return pair.indexOf(value) >= 0;
    })})
  }

  onSelectPair(pair) {
    let comp = this
    this.setState({selectedPair: pair})
    binance.prices().then(results => {
      let priceNow = results[pair]
      let sell = priceNow * (1 + comp.state.profitPercent)
      comp.setState({selectedPair: pair, marketPrice: priceNow, buyPrice: priceNow, sellPrice: sell})
      setTimeout(function() {
        comp.checkPrice()
      })
    })
  }

  profitPercentChange(value) {
    this.setState({
      profitPercent: value,
      sellPrice: this.state.marketPrice * (1 + value),
    });
  }

  changeSellPrice(value) {
    this.setState({
      sellPrice: value,
    });
  }

  changeBuyPrice(value) {
    this.setState({
      buyPrice: value,
    });
  }

  changeQuantity(value) {
    this.setState({
      quantity: value,
    });
  }

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
    //message.success("ran")
  }

  render() {
    return (
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
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
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
                <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                  <Menu.Item key="1">option1</Menu.Item>
                  <Menu.Item key="2">option2</Menu.Item>
                  <Menu.Item key="3">option3</Menu.Item>
                  <Menu.Item key="4">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                  <Menu.Item key="5">option5</Menu.Item>
                  <Menu.Item key="6">option6</Menu.Item>
                  <Menu.Item key="7">option7</Menu.Item>
                  <Menu.Item key="8">option8</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                  <Menu.Item key="9">option9</Menu.Item>
                  <Menu.Item key="10">option10</Menu.Item>
                  <Menu.Item key="11">option11</Menu.Item>
                  <Menu.Item key="12">option12</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                <h3>Create Swing Trade</h3>
                <p>symbol: { this.state.selectedPair }</p>
                <p>price: <span class={this.state.priceColor}>{ this.state.marketPrice }</span></p>
                <Slider
                  min={0.001}
                  max={0.08}
                  step={0.001}
                  defaultValue={0.004}
                  onChange={this.profitPercentChange}
                />
                <Row>
                  <AutoComplete
                    dataSource={this.state.filteredPairs}
                    placeholder='trading pair'
                    onSelect={this.onSelectPair}
                    onSearch={this.onFilterPair}
                  />
                  <InputNumber
                    min={0}
                    value={this.state.quantity}
                    onChange={this.changeQuantity}
                  />
                  <InputNumber
                    min={0}
                    value={this.state.buyPrice}
                    onChange={this.changeBuyPrice}
                  />
                  <InputNumber
                    min={0}
                    value={this.state.sellPrice}
                    onChange={this.changeSellPrice}
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
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
