import React, { Component, PropTypes } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-animatable";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import metrics from "../../config/metrics";

export default class LoginForm extends Component {
  // static propTypes = {
  //   isLoading: PropTypes.bool.isRequired,
  //   onLoginPress: PropTypes.func.isRequired,
  //   onSignupLinkPress: PropTypes.func.isRequired
  // }

  state = {
    email: "eddysapata@gmail.com",
    password: "sapataurgreat",
    fullName: ""
  };

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ]);
    }
  };

  render() {
    const { email, password } = this.state;
    const {
      isLoading,
      onSignupLinkPress,
      onLoginPress,
      onForgotLinkPress,
    } = this.props;
    const isValid = email !== "" && password !== "";
    return (
      <View style={styles.container}>
        <View
          style={styles.form}
          ref={ref => {
            this.formRef = ref;
          }}
        >
          <CustomTextInput
            name={"email"}
            ref={ref => (this.emailInputRef = ref)}
            placeholder={"Email"}
            keyboardType={"email-address"}
            editable={!isLoading}
            returnKeyType={"next"}
            value={this.state.email}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.passwordInputRef.focus()}
            onChangeText={value => this.setState({ email: value })}
            isEnabled={!isLoading}
          />
          <CustomTextInput
            name={"password"}
            ref={ref => (this.passwordInputRef = ref)}
            placeholder={"Password"}
            editable={!isLoading}
            value={this.state.password}
            returnKeyType={"done"}
            secureTextEntry={true}
            withRef={true}
            onChangeText={value => this.setState({ password: value })}
            isEnabled={!isLoading}
          />
        </View>
        <View style={styles.footer}>
          <View
            ref={ref => (this.buttonRef = ref)}
            animation={"bounceIn"}
            duration={600}
            delay={400}
          >
            <CustomButton
              onPress={() => onLoginPress(email, password)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.loginButton}
              textStyle={styles.loginButtonText}
              text={"Log In"}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              ref={ref => (this.linkRef = ref)}
              style={styles.signupLink}
              onPress={onSignupLinkPress}
              animation={"fadeIn"}
              duration={600}
              delay={400}
            >
              {"Not registered yet?"}
            </Text>
            <Text
              ref={ref => (this.linkRef = ref)}
              style={styles.forgotLink}
              onPress={onForgotLinkPress}
              animation={"fadeIn"}
              duration={600}
              delay={400}
            >
              {"Forgot Password?"}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: "center"
  },
  loginButton: {
    backgroundColor: "white"
  },
  loginButtonText: {
    color: "#3E464D",
    fontWeight: "bold"
  },
  signupLink: {
    color: "rgba(255,255,255,0.6)",
    alignSelf: "center",
    padding: 20
  },
  forgotLink: {
    color: "rgba(255,255,255,0.6)",
    alignSelf: "center"
  }
});
