import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  BackHandler
} from "react-native";

import {
  ThemeContext,
  Toolbar,
  getTheme,
  Card
} from "react-native-material-ui";
import uiTheme from "../UI/uiTheme";

export default class ApplicantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  camelToTitle = camelCase =>
    camelCase
      .replace(/([A-Z])/g, match => ` ${match}`)
      .replace(/^./, match => match.toUpperCase())
      .trim();

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  render() {
    let client = this.props.navigation.getParam("client", {});

    let clientRowTitle = [
      "contactNum",
      "address",
      "email",
      "alternateNum",
      "documentType",
      "documentNo",
      "chequeNum"
    ];

    let generateRows = clientRowTitle.map(item => {
      return (
        <View style={styles.listRow} key={client["email"]}>
          <View style={styles.listTitle}>
            <Text style={{ fontWeight: "bold" }}>
              {this.camelToTitle(item) + "  "}:
            </Text>
          </View>
          <View style={styles.listValue}>
            <Text>{client[item]}</Text>
          </View>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <Toolbar
            leftElement="arrow-back"
            centerElement={client.name}
            onLeftElementPress={() => this.props.navigation.goBack()}
          />
        </ThemeContext.Provider>
        <ScrollView>
          <View>
            <View style={styles.headerr} />
            <Image
              style={styles.avatar}
              source={{
                uri: client.image
              }}
            />
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{client.name}</Text>
              </View>
              <View>
                <View style={styles.personalInfoContainer}>{generateRows}</View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listRow: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    marginBottom: 5
  },
  listTitle: {
    width: "50%",
    marginRight: 10,
    paddingLeft: 5,
    alignItems: "flex-end"
  },
  listValue: {
    width: "50%",
    color: "#eee",
    flex: 1
  },
  container: {
    marginBottom: 50
  },
  personalInfoContainer: {
    marginTop: 10,
    flex: 1,
    justifyContent: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "white",
    alignSelf: "center"
  },
  name: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "600"
  },
  body: {
    marginTop: 10
  },
  bodyContent: {
    flex: 1,
    alignItems: "center"
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  }
});
