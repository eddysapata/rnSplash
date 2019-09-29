import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { connect } from "react-redux";

import ListItem from "../../components/ListItem/ListItem";

class GetApplicantList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
  _renderItem = item => {
    let { item: clientItem } = item;
    return (
      <View>
        <ListItem
          onItemSelected={() => this.showClientDetail(clientItem)}
          clientImage={{ uri: clientItem.image }}
          clientName={clientItem.name}
        />
      </View>
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
        {empty_btn}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <FlatList
            style={[{ flex: 2 }]}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            data={this.state.applicantList}
            extraData={this.props}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            style={{ paddding: 10, marginBottom: BOTTOM_TAB_HEIGHT }}
          />
        </ScrollView>
        <ActionButton onPress={this._onActionButtonPress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    applicantList: state.clients.applicants
  };
};

export default connect(mapStateToProps)(GetApplicantList);
