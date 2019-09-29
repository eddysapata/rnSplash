import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";

import Row from "../Row";
const getPlatformElevation = elevation => ({ elevation });

import { getNameByID } from "../../../utility/firebaseHelpers";

class Content extends PureComponent {
  state = {
    submittedName: ""
  };

  updateIDWithName = async () => {
    let res = await getNameByID(this.props.submittedByID);
    this.setState({
      submittedName: res.name
    });
  };

  componentDidMount() {
    this.updateIDWithName();
  }

  render() {
    const props = this.props;

    return (
      <Row style={styles.container}>
        <View style={styles.cellContainer}>
          <Text style={styles.titleText}>Monthly Date</Text>
          <Text>{props.startDate}</Text>
        </View>
        <View style={styles.cellContainer}>
          <Text style={styles.titleText}>Installment</Text>
          <Text style={styles.amountText}>{props.monthlyInstallment}</Text>
        </View>
        <View style={styles.cellContainer}>
          <Text style={styles.titleText}>Interest</Text>
          <Text style={styles.amountText}>{props.interestRate}</Text>
        </View>
        <View style={styles.cellContainer}>
          <Text style={styles.titleText}>Submitted By</Text>
          <Text>{this.state.submittedName}</Text>
        </View>
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    alignItems: "center"
  },
  cellContainer: {
    flex: 1
  },
  titleText: {
    fontSize: 10,
    color: "gray"
  },
  amountText: {
    fontSize: 18,
    fontWeight: "900"
  }
});

export default Content;
