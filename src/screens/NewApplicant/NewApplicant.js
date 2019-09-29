import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
  DatePickerAndroid
} from "react-native";

import update from "immutability-helper";

import Autocomplete from "react-native-autocomplete-input";

import { Toolbar, Card } from "react-native-material-ui";
import { uiStart, uiEnd } from "../../store/actions/index";

import { Container, Content } from "native-base";
import { connect } from "react-redux";

import { Thumbnail, Root } from "native-base";
import { TextField } from "react-native-material-textfield";

import { updateUserProfile, addNewApplicant } from "../../store/actions/index";

class NewApplicant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsList: [],
      isClientSelected: false,
      newApplicant: {
        name: "",
        clientID: "",
        totalAmount: "",
        interestRate: "",
        tenure: "",
        startDate: "",
        monthlyPaymentDate: "",
        monthlyInstallment: "",
        submittedByName: "",
        submittedByID: "",
        remainingAmount: ""
        //remainingTenure: "",
        //endDate: ""
      },
      query: "",
      selectedClient: {
        name: "",
        image: ""
      }
    };
    this.baseState = this.state;
  }

  onSaveProfile = async () => {
    this.props.loadingStart();

    let applicantData = this.state.newApplicant;

    await this.props.onAddNewApplicant(applicantData);
    this.setState(this.baseState);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  onSearchSelect = client => {
    let currentState = this.state;
    let { name, image, clientID } = client;

    const newData = update(currentState, {
      isClientSelected: { $set: true },
      query: { $set: "" },
      selectedClient: {
        name: { $set: name },
        image: { $set: image }
      },
      newApplicant: {
        clientID: { $set: clientID },
        name: { $set: name }
      }
    });

    this.setState(newData);
    Keyboard.dismiss();
  };

  calculateMonthlyInstallment = () => {
    currentState = this.state;
    let { totalAmount, interestRate } = this.state.newApplicant;

    if (totalAmount !== "" && interestRate !== "") {
      let monthlyInstallment = (totalAmount * interestRate) / 100;
      const newData = update(currentState, {
        newApplicant: {
          monthlyInstallment: { $set: `${monthlyInstallment}` },
          remainingAmount: { $set: `${totalAmount}` }
        }
      });
      this.setState(newData);
    }
  };

  findClient(query) {
    if (query === "") {
      return [];
    }

    const { clientsList } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return clientsList.filter(client => client.name.search(regex) >= 0);
  }

  newApplicantTextHandler = (key, value) => {
    let currentState = this.state;

    const newData = update(currentState, {
      newApplicant: {
        [key]: { $set: value }
      }
    });

    this.setState(newData);
  };

  selectStartDate = async () => {
    try {
      let { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(),
        mode: "default"
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        month = month + 1;
        const startDate = `${day}/${month}/${year}`;
        const monthlyPaymentDate = `${day}`;
        this.newApplicantTextHandler("monthlyPaymentDate", monthlyPaymentDate);
        this.newApplicantTextHandler("startDate", startDate);
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  componentDidMount() {
    let { clientsList } = this.props;
    let currentState = this.state;

    const newData = update(currentState, {
      clientsList: {
        $set: clientsList
      },
      newApplicant: {
        submittedByName: { $set: this.props.loggedInUser.name },
        submittedByID: { $set: this.props.loggedInUser.userID }
      }
    });

    this.setState(newData);

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  render() {
    let imageSource = { uri: this.state.selectedClient.image };

    if (this.state.selectedClient.image === "") {
      imageSource = require("../../images/profile_pic.jpg");
    }

    const { query } = this.state;
    const clientsList = this.findClient(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    let loader = <ActivityIndicator color="#fff" size={25} />;

    return (
      <Root>
        <Container>
          <Toolbar
            isEditProfileTab={true}
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigation.goBack()}
            rightElement={this.props.isLoading ? loader : "check"}
            centerElement="New Applicant"
            onRightElementPress={this.onSaveProfile}
          />
          <Content>
            <Autocomplete
              autoCapitalize="none"
              listStyle={styles.listStyle}
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              listContainerStyle={styles.listContainerStyle}
              data={
                clientsList.length === 1 && comp(query, clientsList[0].name)
                  ? []
                  : clientsList
              }
              defaultValue={query}
              onChangeText={text => this.setState({ query: text })}
              placeholder="Search Client"
              renderItem={client => (
                <TouchableOpacity onPress={() => this.onSearchSelect(client)}>
                  <Text style={styles.itemText}>{client.name}</Text>
                </TouchableOpacity>
              )}
            />
            <ScrollView style={styles.mainContainer}>
              <KeyboardAvoidingView>
                <View style={styles.avatarContainer}>
                  <Thumbnail large source={imageSource} />
                </View>
                <View style={styles.textInputStyle}>
                  <TextField
                    label="User Name"
                    value={this.state.selectedClient.name}
                    animationDuration={255}
                    disabled={true}
                  />
                  <TextField
                    label="Total Amount"
                    value={this.state.newApplicant.totalAmount}
                    animationDuration={255}
                    disabled={!this.state.isClientSelected}
                    keyboardType="number-pad"
                    onChangeText={totalAmount => {
                      return this.newApplicantTextHandler(
                        "totalAmount",
                        totalAmount
                      );
                    }}
                  />
                  <TextField
                    label="Interest Rate"
                    value={this.state.newApplicant.interestRate}
                    animationDuration={255}
                    disabled={!this.state.isClientSelected}
                    keyboardType="number-pad"
                    onChangeText={interestRate =>
                      this.newApplicantTextHandler("interestRate", interestRate)
                    }
                  />
                  <TextField
                    label="Tenure"
                    value={this.state.newApplicant.tenure}
                    animationDuration={255}
                    disabled={!this.state.isClientSelected}
                    keyboardType="number-pad"
                    onChangeText={tenure =>
                      this.newApplicantTextHandler("tenure", tenure)
                    }
                  />
                  <TouchableOpacity onPress={this.calculateMonthlyInstallment}>
                    <TextField
                      label="Monthly Installment"
                      keyboardType="number-pad"
                      value={this.state.newApplicant.monthlyInstallment}
                      animationDuration={255}
                      disabled={true}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.selectStartDate}>
                    <TextField
                      label="Start Date"
                      value={this.state.newApplicant.startDate}
                      animationDuration={255}
                      disabled={true}
                      pointerEvents="none"
                      keyboardType="number-pad"
                    />
                  </TouchableOpacity>
                  <TextField
                    label="Monthly PaymentDate"
                    value={this.state.newApplicant.monthlyPaymentDate}
                    animationDuration={255}
                    disabled={true}
                    keyboardType="number-pad"
                  />
                  <TextField
                    label="Submitted By"
                    value={this.state.newApplicant.submittedByName}
                    animationDuration={255}
                    disabled={true}
                  />
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 50
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1
  },
  itemText: {
    //fontSize: 20,
    marginBottom: 10
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: "#F5FCFF"
    //marginTop: 25
  },
  listStyle: {
    padding: 15,
    margin: 0,
    backgroundColor: "rgba(25,118,210,0.8)"
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center"
  },
  textInputStyle: {
    padding: 10
  },
  listContainerStyle: {},
  avatarContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 1
  },
  editPicStyle: {
    margin: 10,
    backgroundColor: "#eee",
    padding: 4,
    color: "#000",
    fontWeight: "bold",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#eee"
  }
});

const mapStateToProps = state => {
  return {
    loggedInUser: state.clients.user,
    isLoading: state.ui.isLoading,
    clientsList: state.clients.clients
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddNewApplicant: clientData => dispatch(addNewApplicant(clientData)),
    loadingStart: () => dispatch(uiStart()),
    loadingStop: () => dispatch(uiEnd())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewApplicant);
