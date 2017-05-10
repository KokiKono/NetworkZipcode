'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View,Keyboard} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Button,
  Header,
  Left,
  Body,
  Title,
  Right,
  List,
  ListItem,
  Toast
} from 'native-base';

export default class NetworkZipCode extends Component {
  render() {
    return (
      <Container>
        <MyHeader/>
        <Content style={{marginTop:10}}>
          <AppContent/>
        </Content>
      </Container>
    );
  }
}
class MyHeader extends Component {
  render() {
    return (
      <Header>
        <Left></Left>
        <Body>
          <Title>住所検索</Title>
        </Body>
        <Right></Right>
      </Header>
    );
  }
}
class AppContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: '',
      address: {
        pref: ''
      }
    };
  }
  render() {
    return (
      <Content>
        <Form>
          <Item>
            <Input placeholder='zipcode(○○○-○○○○のみ)'
              keyboardType='numeric'
              onChangeText={(text) => this.onChangeText(text)}
              value={this.state.zipCode} maxLength={9}
              autoFocus={true}/>
          </Item>
        </Form>
        <Address style={{marginTop:50}} address = {
          this.state.address
        }/>
      </Content>

    );
  }
  onChangeText(text) {
    if (text === null) {
      return;
    }
    if (text.length == 8) {
      Keyboard.dismiss();
      this.setState({zipCode: text});
      this._onFetch(text);
      return;
    }
    if (this.state.zipCode.length < text.length) {
      if (text.length == 3) {
        this.setState({
          zipCode: text + '-'
        });
        return;
      }
    }
    this.setState({zipCode: text});
  }
  _onFetch(zipCode) {
    fetch('http://api.zipaddress.net?zipcode=' + zipCode, {method: 'POST'}).then((response) => response.json()).then((responseJson) => {
      if (responseJson.code !== 200) {
        Toast.show({text: '検索できなかったyo！', position: 'bottom', buttonText: 'Ok'});
        return;
      }
      this.setState({address: responseJson.data})
    }).catch((error) => {
      console.error(error);
    }).done();
  }
}
class Address extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <List>
          <ListItem>
            <Text>都道府県：{this.props.address.pref}</Text>
          </ListItem>
          <ListItem>
            <Text>住所：{this.props.address.address}</Text>
          </ListItem>
          <ListItem>
            <Text>市：{this.props.address.city}</Text>
          </ListItem>
          <ListItem>
            <Text>町：{this.props.address.town}</Text>
          </ListItem>
          <List>
            <ListItem>
              <Text>fullAddress：{this.props.address.fullAddress}</Text>
            </ListItem>
          </List>
        </List>
      </View>
    );
  }
}
