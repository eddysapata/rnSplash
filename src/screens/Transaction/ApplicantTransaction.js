import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  BackHandler,
  StyleSheet,
  Button,
  TouchableOpacity
} from "react-native";

import {
  ThemeContext,
  Toolbar,
  getTheme,
  Card
} from "react-native-material-ui";
import uiTheme from "../UI/uiTheme";

import firebase from "react-native-firebase";
import moment from "moment";
import update from "immutability-helper";
import { Table, Row, Rows } from "react-native-table-component";
import Modal from "react-native-modal";
import { TextField } from "react-native-material-textfield";

class ApplicantTrasaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isVisible: false,
      tableHead: ["Date", "Amount", "Mode", "Ref.", "Note", "SubmittedBy"],
      users: [],
      addMoney: {}
    };
  }

  getUserName = id => {
    let allUsers = this.state.users;
    let userName = id;
    allUsers.forEach(user => {
      if (user.userID === id) {
        userName = user.name;
      }
    });
    return userName;
  };

  toggleModal = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  componentDidMount() {
    let db = firebase.firestore();
    let {
      applicantID,
      totalAmount,
      interestRate,
      monthlyInstallment
    } = this.props.navigation.getParam("client", "");

    let currentState = Object.assign({}, this.state);

    const newData = update(currentState, {
      addMoney: {
        totalAmount: { $set: `${totalAmount}` },
        interestRate: { $set: `${interestRate}` },
        monthlyInstallment: { $set: `${monthlyInstallment}` }
      }
    });
    this.setState(newData);

    let that = this;

    let currentYear = moment().format("Y");

    db.collection("userInfo")
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(function(doc) {
          users.push(doc.data());
        });

        this.setState({
          users
        });
      });

    db.collection(`transaction${currentYear}`)
      .doc(applicantID)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const result = Object.values(
            Object.entries(doc.data()).reduce((acc, [key, val]) => {
              const num = key.charAt(key.length - 1); // get digit at end of key
              const newKey = key.replace(/_\d/, ""); // remove underscore before digit
              acc[num] = acc[num] || {}; // create a default entry if needed
              acc[num][newKey] = val; // set value for the new key
              return acc;
            }, {})
          );

          that.setState({
            transactions: result
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  calculateMonthlyInstallment = () => {
    currentState = this.state;
    let { totalAmount, interestRate } = this.state.addMoney;

    if (totalAmount !== "" && interestRate !== "") {
      let monthlyInstallment = (totalAmount * interestRate) / 100;
      const newData = update(currentState, {
        addMoney: {
          monthlyInstallment: { $set: `${monthlyInstallment}` }
        }
      });
      this.setState(newData);
    }
  };

  addMoneyHandler = (key, value) => {
    let currentState = this.state;

    const newData = update(currentState, {
      addMoney: {
        [key]: { $set: value }
      }
    });

    this.setState(newData);
  };

  render() {
    const state = this.state;
    const {
      name:clientName,
    } = this.props.navigation.getParam("client", "Default");

    let tableContent = [];
    let tableDataa = this.state.transactions.map(item => {
      let formatedDate = moment(item.date, "DD/MM/YYYY").format("MMMM Do YYYY");
      let submittedName = this.getUserName(item.submittedByID);

      let arr = [
        formatedDate,
        item.amount,
        item.modeOfPayment,
        item.refNum,
        item.note,
        submittedName
      ];
      tableContent.push(arr);
    });

    return (
      <View style={{ flex: 1 }}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <Toolbar
            leftElement="arrow-back"
            centerElement={clientName}
            onLeftElementPress={() => this.props.navigation.goBack()}
          />
        </ThemeContext.Provider>
        <View style={styles.modalContainer}>
          <Modal isVisible={this.state.isVisible}>
            <View style={styles.modalContent}>
              <View style={styles.textInputStyle}>
                <TextField
                  label="Total Amount"
                  value={this.state.addMoney.totalAmount}
                  animationDuration={255}
                  keyboardType="number-pad"
                  onChangeText={totalAmount => {
                    return this.addMoneyHandler("totalAmount", totalAmount);
                  }}
                />
                <TextField
                  label="Amount"
                  value={this.state.addMoney.amount}
                  animationDuration={255}
                  keyboardType="number-pad"
                  onChangeText={amount => {
                    return this.addMoneyHandler("amount", amount);
                  }}
                />
                <TextField
                  label="Interest Rate"
                  value={this.state.addMoney.interestRate}
                  animationDuration={255}
                  keyboardType="number-pad"
                  onChangeText={interestRate =>
                    this.addMoneyHandler("interestRate", interestRate)
                  }
                />
                <TouchableOpacity onPress={this.calculateMonthlyInstallment}>
                  <TextField
                    label="Monthly Installment"
                    keyboardType="number-pad"
                    value={this.state.addMoney.monthlyInstallment}
                    animationDuration={255}
                    disabled={true}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Button
                  onPress={this.toggleModal}
                  title="Save"
                  color="#3aa091"
                />
                <Button
                  onPress={this.toggleModal}
                  title="Cancel"
                  color="#e91e63"
                />
              </View>
            </View>
          </Modal>
        </View>
        <Button onPress={this.toggleModal} title="Show Modal" />
        <ScrollView style={styles.container}>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={state.tableHead}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={tableContent} textStyle={styles.text} />
          </Table>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    //height:'50%',
    //justifyContent: "center",
    //alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  textInputStyle: {
    padding: 10
  }
});

export default ApplicantTrasaction;

// date: "",
// amount: "",
// modeOfPayment: "Cash",
// refNum: "",
// note: "",
