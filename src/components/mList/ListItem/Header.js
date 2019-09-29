import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";

import Avatar from "./Avatar";
import Row from "../Row";
//import assets from "../../assets";

import Icons from "react-native-vector-icons/FontAwesome5";

class Header extends PureComponent {
  render() {
    const { name, image, isApplicant, totalAmount, remainingAmount } = this.props;

    let totalAmountView = null;

    if (isApplicant) {
      totalAmountView = (
        <View style={styles.rightContainer}>
          <Icons name="rupee-sign" size={20}/>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {`${remainingAmount}/${totalAmount}`}
          </Text>
        </View>
      );
    }

    return (
      <Row style={styles.container}>
          <View>
            <Avatar text={"AMAN"} src={{ uri: image }} />
          </View>
        <View style={styles.nameContainer}>
          <Text>{name}</Text>
        </View>
        {totalAmountView}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    alignItems: "center"
  },
  nameContainer: {
    flex: 1,
    marginLeft: 16
  },
  rightContainer: {
    width: 48,
    height: 48,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Header;
