import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image
} from "react-native";

import * as Animatable from "react-native-animatable";

bounce = () =>
  this.view
    .bounce(800)
    .then(endState =>
      console.log(endState.finished ? "bounce finished" : "bounce cancelled")
    );

const listItem = props => (
  <TouchableNativeFeedback onPress={props.onItemSelected}>
    <Animatable.View
      animation={"slideInLeft"}
      delay={600}
      duration={400}
      style={styles.listItem}
    >
      <Image style={styles.imageStyle} source={props.clientImage} />
      <Text style={{ color: "#fff" }}>{props.clientName}</Text>
    </Animatable.View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    padding: 10,
    marginBottom: 0.5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)"
  },
  imageStyle: {
    marginRight: 10,
    height: 40,
    width: 40,
    borderRadius: 20
  }
});

export default listItem;
