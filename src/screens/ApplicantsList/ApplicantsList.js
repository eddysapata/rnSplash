import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
  RefreshControl
} from "react-native";

import { DrawerActions } from "react-navigation";

import Sound from "react-native-sound";

import { connect } from "react-redux";

//onesignal
import OneSignal from "react-native-onesignal";

import { MListItem } from "../../components/mList";

import { getAllApplicantList } from "../../store/actions";

import {
  ThemeContext,
  Toolbar,
  getTheme
  //ActionButton
} from "react-native-material-ui";
import uiTheme from "../UI/uiTheme";
//import { Button } from "native-base";

import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import FAIcons from "react-native-vector-icons/FontAwesome5";

class ApplicantList extends Component {
  handleViewRef = ref => (this.view = ref);

  state = {
    applicantLoaded: false,
    removeAnim: new Animated.Value(1),
    placesAnim: new Animated.Value(0),
    allApplicantData: this.props.allApplicantData
  };

  constructor(props) {
    super(props);

    //one signal Code
    OneSignal.init("70a59c6d-e3fa-4324-ae0c-27e912b4e849");
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);

    this.arrayholder = this.props.allApplicantData;
    Sound.setCategory("Playback");

    this.whoosh = new Sound("fab_button.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.allApplicantData !== prevProps.allApplicantData) {
      this.setState({
        allApplicantData: this.props.allApplicantData
      });
      this.arrayholder = this.props.allApplicantData;
    }
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

  playsound = () => {
    this.whoosh.play();
  };

  onIds(device) {
    console.log("Device info: ", device);
  }
  //Onesignal Ends

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({ allApplicantData: newData });
  };

  placesLoadedHandler = () => {
    Animated.timing(this.state.placesAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  _onRefresh = async (customRefresh = false) => {
    if (!customRefresh) {
      this.setState({
        refreshing: true
      });
    }
    this.props.getAllApplicantList();
    this.setState({
      refreshing: false,
      allApplicantData: this.props.allApplicantData
    });
    this.arrayholder = this.props.allApplicantData;
  };

  _keyExtractor = (item, index) => item.applicantID;

  placesSearchHandler = async () => {
    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      this.props.getAllApplicantList();

      this.setState({
        placesLoaded: true
      });
      this.placesLoadedHandler();
    });
  };

  _newApplicantfab = () => {
    this.props.navigation.navigate("newApplicant");
  };

  _newTransactionfab = () => {
    this.props.navigation.navigate("newTransaction");
  };

  showTransaction = (client) => {
    this.props.navigation.navigate("applicantTransaction", {
      client: client,
    });
  };

  _renderItem = (item) => {
    let { item: clientItem } = item;
    return (
      <MListItem
        item={clientItem}
        onItemSelected={() =>
          this.showTransaction(clientItem)
        }
        isApplicant={true}
      />
    );
  };

  render() {
    const props = this.props;

    let empty_btn = null;

    if (this.props.allApplicantData.length == 0) {
      empty_btn = (
        <View
          style={{
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0)"
          }}
        >
          <TouchableOpacity onPress={() => this._onRefresh()}>
            <Text>No content.</Text>
          </TouchableOpacity>
        </View>
      );
    }

    let content = (
      <Animated.View
        style={{
          opacity: this.state.removeAnim,
          transform: [
            {
              scale: this.state.removeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 1]
              })
            }
          ]
        }}
      >
        <TouchableOpacity onPress={this.placesSearchHandler}>
          <View style={styles.searchButton}>
            <Text style={styles.searchBtnText}>Get Applicants</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );

    if (this.state.placesLoaded && this.props.allApplicantData.length !== 0) {
      content = (
        <Animated.View
          style={{
            opacity: this.state.placesAnim
          }}
        >
          {empty_btn}
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            data={this.state.allApplicantData}
            extraData={this.props}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            style={{ paddding: 10, marginBottom: 100 }}
          />
        </Animated.View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <Toolbar
            leftElement="menu"
            centerElement="Applicants List"
            onLeftElementPress={() =>
              props.navigation.dispatch(DrawerActions.openDrawer())
            }
            // searchable={{
            //   onChangeText: this.searchFilterFunction,
            //   autoFocus: true,
            //   //onSearchClosed: this.setState(this.arrayholder),
            //   placeholder: "Search Applicants"
            // }}
          />
          <View style={this.state.placesLoaded ? null : styles.buttonContainer}>
            {content}
          </View>
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            onPress={this.playsound}
          >
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="New Applicant"
              onPress={this._newApplicantfab}
            >
              <Icon name="md-person" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#3498db"
              title="New Transaction"
              onPress={this._newTransactionfab}
            >
              <FAIcons name="rupee-sign" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </ThemeContext.Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  searchButton: {
    borderColor: "orange",
    borderWidth: 3,
    borderRadius: 50,
    padding: 20
  },
  searchBtnText: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 26
  }
});

const mapStateToProps = state => {
  return {
    allApplicantData: state.clients.applicants
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllApplicantList: () => dispatch(getAllApplicantList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicantList);
