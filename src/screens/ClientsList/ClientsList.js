import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions
} from "react-native";

import {
  ThemeContext,
  Toolbar,
  getTheme,
  ActionButton
} from "react-native-material-ui";

import { DrawerActions } from "react-navigation";
import uiTheme from "../UI/uiTheme";
import * as Animatable from "react-native-animatable";

import { getAllClientList } from "../../store/actions/index";

import { MListItem } from "../../components/mList";

import { connect } from "react-redux";

const BOTTOM_TAB_HEIGHT = 50;

class ClientsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allClientData: this.props.allClientData,
      refreshing: false,
      active: true
    };
    this.arrayholder = this.props.allClientData;
  }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({ allClientData: newData });
  };

  _onRefresh = async (customRefresh = false) => {
    if (!customRefresh) {
      this.setState({
        refreshing: true
      });
    }
    await this.props.onGetAllClientList();
    this.setState({
      refreshing: false,
      allClientData: this.props.allClientData
    });
    this.arrayholder = this.props.allClientData;
  };

  _keyExtractor = (item, index) => item.name;

  showClientDetail = client => {
    this.props.navigation.push("clientsDetail", { client: client });
  };

  _onActionButtonPress = () => {
    this.props.navigation.navigate("newClient");
  };

  _renderItem = item => {
    let { item: clientItem } = item;
    return (
      <MListItem
        item={clientItem}
        //onPress={this.onListItemPressed}
        onItemSelected={() => this.showClientDetail(clientItem)}
        isApplicant={false}
      />
    );
  };

  render() {
    const props = this.props;
    let empty_btn = null;

    if (this.state.allClientData.length == 0) {
      empty_btn = (
        <View
          style={{
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0)"
          }}
        >
          <Text>No content.</Text>
          <Button title="Refresh" onPress={() => this._onRefresh(true)} />
        </View>
      );
    }
    return (
        <View style={{ flex: 1 }}>
          <ThemeContext.Provider value={getTheme(uiTheme)}>
            <Toolbar
              leftElement="menu"
              centerElement="Clients List"
              onLeftElementPress={() =>
                props.navigation.dispatch(DrawerActions.openDrawer())
              }
              searchable={{
                onChangeText: this.searchFilterFunction,
                autoFocus: true,
                //onSearchClosed: this.setState(this.arrayholder),
                placeholder: "Search Applicants"
              }}
            />
            {empty_btn}
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              data={this.state.allClientData}
              extraData={this.props}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              style={{ paddding: 10, marginBottom: BOTTOM_TAB_HEIGHT }}
            />
            <ActionButton onPress={this._onActionButtonPress} />
          </ThemeContext.Provider>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#1976D2",
    margin: 20
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  }
});

const mapStateToProps = state => {
  return {
    allClientData: state.clients.clients
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetAllClientList: () => dispatch(getAllClientList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientsList);
