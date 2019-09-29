import React, { PureComponent } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

import _ from "lodash";
import Header from "./Header";
import Content from "./Content";

const getPlatformElevation = elevation => ({ elevation });

class ListItem extends PureComponent {
  onPressed = event => {
    this.props.onItemSelected();
  };

  render() {
    const { item, isApplicant } = this.props;
    const { name, image, ...rest } = item;

    let returnList = <Text>Loading...</Text>;

    if (isApplicant) {
      returnList = (
        <TouchableWithoutFeedback onPress={this.onPressed}>
          <View style={[styles.container]} pointerEvents="box-only">
            <Header isApplicant={isApplicant} {...item} />
            <Content {...rest} />
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      returnList = (
        <TouchableWithoutFeedback onPress={this.onPressed}>
          <View style={[styles.container]} pointerEvents="box-only">
            <Header isApplicant={isApplicant} {...item} />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return returnList;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    ...getPlatformElevation(2)
  }
});

export default ListItem;
