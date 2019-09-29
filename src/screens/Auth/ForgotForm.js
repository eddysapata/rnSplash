import React, { Component, PropTypes } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-animatable";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import metrics from "../../config/metrics";

export default class ForgotForm extends Component {
  state = {
    email: "eddysapata@gmail.com"
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
    const { email } = this.state;
    const { isLoading, onForgotPress, onLoginLinkPress } = this.props;
    const isValid = email !== "";
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
            //onSubmitEditing={() => this.passwordInputRef.focus()}
            onChangeText={value => this.setState({ email: value })}
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
              onPress={() => onForgotPress(email)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.forgotButton}
              textStyle={styles.forgotButtonText}
              text={"Send Link"}
            />
            <Text
              ref={(ref) => this.linkRef = ref}
              style={styles.loginLink}
              onPress={onLoginLinkPress}
              animation={'fadeIn'}
              duration={600}
              delay={400}
            >
              {'Already have an account?'}
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
  forgotButton: {
    backgroundColor: "white"
  },
  forgotButtonText: {
    color: "#3E464D",
    fontWeight: "bold"
  },
  loginLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 20
  }
});
