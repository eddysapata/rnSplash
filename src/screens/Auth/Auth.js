import React, { Component } from "react";
import firebase from "react-native-firebase";
import { Toast, Root } from "native-base";
import { connect } from "react-redux";

import Snackbar from "react-native-snackbar";

//Import Components
import AuthIndex from "./AuthIndex";

//redux
import { tryAuth, getUserData } from "../../store/actions/index";
import { uiStart, uiEnd } from "../../store/actions/index";

export class AuthScreen extends Component {
  state = {
    //isLoggedIn: false, // Is the user authenticated?
    //isLoading: false, // Is the user loggingIn/signinUp?
    isAppReady: false, // Has the app completed the login animation?
    visibleForm: null,
    showToast: false
  };

  _visibleFormHandler = visibleForm => {
    this.setState({
      visibleForm
    });
  };

  _simulateLogin = (email, password) => {
    this.props.loadingStart();
    this.setState({
      isLoading: this.props.isLoading
    });
    this.props.tryAuth(email, password);
  };

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.navigation.navigate("Landing");
    }
  }

  _simulateForgot = email => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, "@@@")
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/user-not-found") {
          Snackbar.show({
            title: `${email} doesnot exist`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red"
          });
        } else if (errorCode === "auth/wrong-password") {
          firebase.auth().sendPasswordResetEmail(email);
          Snackbar.show({
            title: ` Link has been sent to ${email}`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green"
          });
        } else {
          alert("Something Went Wrong !!");
        }
      });
  };

  _simulateSignup = async (email, password, fullName) => {
    this.setState({ isLoading: true });
    let storage = firebase.storage();
    let pathReference = storage.ref(
      "defaultPics/userDefaultPic/profile_pic.jpg"
    );
    let defaultImagePath = await pathReference.getDownloadURL();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        if (user) {
          let db = firebase.firestore();
          let uid = firebase.auth().currentUser.uid;
          db.collection("userInfo")
            .add({
              name: fullName,
              emailAddress: email,
              image: defaultImagePath,
              userID: uid
            })
            .then(docRef => {
              Toast.show({
                text: "User Succesfully Created, Please Login!",
                buttonText: "Okay",
                //position: "top",
                duration: 4000
              });
              setTimeout(
                () => this.setState({ visibleForm: "LOGIN", isLoading: false }),
                1000
              );
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        }
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  /**
   * Simple routing.
   * If the user is authenticated (isAppReady) show the ApplicantListScreen, otherwise show the AuthScreen
   */
  render() {
    return (
      <Root>
        <AuthIndex
          visibleForm={this.state.visibleForm}
          login={this._simulateLogin}
          signup={this._simulateSignup}
          forgot={this._simulateForgot}
          isLoggedIn={this.props.isLoggedIn}
          isLoading={this.props.isLoading}
          visibleFormHandler={visibleForm =>
            this._visibleFormHandler(visibleForm)
          }
          onLoginAnimationCompleted={() =>
            this.props.navigation.navigate("Landing")
          }
        />
      </Root>
    );
  }
}
const mapStateToProps = state => {
  return {
    isLoggedIn: state.clients.user.isLoggedIn,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    tryAuth: (email, password) => dispatch(tryAuth(email, password)),
    loadingStart: () => dispatch(uiStart()),
    loadingStop: () => dispatch(uiEnd()),
    onGetUserData: uid => dispatch(getUserData(uid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreen);
