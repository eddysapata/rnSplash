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

import Icon from "react-native-vector-icons/Ionicons";

import { Toolbar, Card } from "react-native-material-ui";
import { uiStart, uiEnd } from "../../store/actions/index";

import { Container, Content } from "native-base";
import { connect } from "react-redux";

import { Dropdown } from "react-native-material-dropdown";

import _ from "lodash";

import { Thumbnail, Root } from "native-base";
import { TextField } from "react-native-material-textfield";

import { newTransaction } from "../../store/actions/index";
import validate from "../../utility/Validation";

class NewTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicantList: [],
      isClientSelected: false,
      newTransaction: {
        modeOfPayment: "Cash",
        date: "",
        amount: "",
        refNum: "",
        note: "",
        clientID: "",
        applicantID:"",
        totalAmount:""
      },
      errors: {},
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
    let transactionData = this.state.newTransaction;
    await this.props.onNewTransaction(transactionData);
    this.props.loadingStop();
    this.setState(this.baseState);
    this.props.navigation.goBack();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  onSearchSelect = applicant => {
    let currentState = Object.assign({}, this.state);

    ///Removing amount from validation
    delete currentState.errors["amount"];

    let { name, image, clientID, monthlyInstallment, applicantID, totalAmount } = applicant;

    const newData = update(currentState, {
      isClientSelected: { $set: true },
      query: { $set: "" },
      selectedClient: {
        name: { $set: name },
        image: { $set: image }
      },
      newTransaction: {
        amount: { $set: monthlyInstallment },
        modeOfPayment: { $set: "Cash" },
        clientID: { $set: clientID },
        applicantID: { $set: applicantID },
        totalAmount: {$set:totalAmount}
      }
    });

    this.setState(newData);
    Keyboard.dismiss();
  };

  findClient(query) {
    if (query === "") {
      return [];
    }
    const { applicantList } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return applicantList.filter(client => client.name.search(regex) >= 0);
  }

  readyTosave = () => {
    let { newTransaction } = this.state;

    let errors = {};

    _.forEach(newTransaction, function(value, key) {
      if (!value) {
        errors[key] = "Should not be empty";
      }
    });

    this.setState({ errors });

    if (newTransaction.date !== "" && newTransaction.amount !== "") {
      this.onSaveProfile();
    }
  };

  newApplicantTextHandler = (key, value) => {
    let currentState = Object.assign({}, this.state);

    checkValidate = validate(value, { [key]: true });

    validateMessage = "";

    if (checkValidate.isValid) {
      delete currentState.errors[key];
    } else {
      validateMessage = checkValidate.message;
    }

    const newData = update(currentState, {
      newTransaction: {
        [key]: { $set: value }
      },
      errors: {
        [key]: { $set: validateMessage }
      }
    });

    this.setState(newData);
  };

  selectDate = async () => {
    try {
      let { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(),
        mode: "default"
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        month = month + 1;
        const date = `${day}/${month}/${year}`;
        this.newApplicantTextHandler("date", date);
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  async componentDidMount() {
    let { applicantList } = this.props;
    let currentState = this.state;

    const newData = update(currentState, {
      applicantList: {
        $set: applicantList
      },
      newTransaction: {
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

    //Mode of payment
    let selectMOP = [
      { value: "Cash" },
      { value: "G-Pay" },
      { value: "Paytm" },
      { value: "Other" }
    ];

    const { query } = this.state;
    const applicantList = this.findClient(query);
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
            centerElement="New Transaction"
            onRightElementPress={this.readyTosave}
          />
          <Content>
            <Autocomplete
              autoCapitalize="none"
              listStyle={styles.listStyle}
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              listContainerStyle={styles.listContainerStyle}
              data={
                applicantList.length === 1 && comp(query, applicantList[0].name)
                  ? []
                  : applicantList
              }
              defaultValue={query}
              onChangeText={text => this.setState({ query: text })}
              placeholder={"Search Applicant"}
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
                {/* modeOfPayment01: date01: amount: submittedBy01: refNum01:  note01:*/}
                <View style={styles.textInputStyle}>
                  <TextField
                    label="User Name"
                    value={this.state.selectedClient.name}
                    animationDuration={255}
                    disabled={true}
                  />
                  <TextField
                    label="Amount"
                    value={this.state.newTransaction.amount}
                    animationDuration={255}
                    error={this.state.errors.amount}
                    disabled={!this.state.isClientSelected}
                    keyboardType="number-pad"
                    onChangeText={amount =>
                      this.newApplicantTextHandler("amount", amount)
                    }
                  />
                  <Dropdown
                    label="Document Type"
                    data={selectMOP}
                    disabled={!this.state.isClientSelected}
                    onChangeText={modeOfPayment =>
                      this.newApplicantTextHandler(
                        "modeOfPayment",
                        modeOfPayment
                      )
                    }
                    value={this.state.newTransaction.modeOfPayment}
                  />
                  <TextField
                    label="TransactionID"
                    value={this.state.newTransaction.refNum}
                    animationDuration={255}
                    disabled={!this.state.isClientSelected}
                    onChangeText={refNum =>
                      this.newApplicantTextHandler("refNum", refNum)
                    }
                  />
                  <TouchableOpacity onPress={this.selectDate}>
                    <TextField
                      label="Date"
                      error={this.state.errors.date}
                      value={this.state.newTransaction.date}
                      animationDuration={255}
                      disabled={true}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                  <TextField
                    label="Note (optional)"
                    value={this.state.newTransaction.note}
                    animationDuration={255}
                    multiline={true}
                    numberOfLines={4}
                    characterRestriction={140}
                    disabled={!this.state.isClientSelected}
                    onChangeText={note =>
                      this.newApplicantTextHandler("note", note)
                    }
                  />
                  <TextField
                    label="Submitted By"
                    value={this.props.loggedInUser.name}
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
  listContainerStyle: {
    flex:1
  },
  avatarContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 1
  }
});

const mapStateToProps = state => {
  return {
    loggedInUser: state.clients.user,
    isLoading: state.ui.isLoading,
    applicantList: state.clients.applicants
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNewTransaction: transactionData =>
      dispatch(newTransaction(transactionData)),
    loadingStart: () => dispatch(uiStart()),
    loadingStop: () => dispatch(uiEnd())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTransaction);
