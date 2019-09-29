import React, { Component } from "react";
import { connect } from "react-redux";

import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator
} from "react-native";

import { Drawer, Avatar, Divider } from "react-native-material-ui";
import {
  DrawerActions,
  NavigationActions,
  StackActions
} from "react-navigation";

import { logoutAction } from "../../store/actions/index";

import firebase from "react-native-firebase";

class SidebarScreen extends Component {
  state = {
    isLoggedOut: false
  };

  _isMounted = false;

  constructor(props) {
    super(props);
  }

  editProfileHandler = () => {
    this.props.navigation.navigate("editProfile");
  };

  goToLoginPage = () => {
    console.log("LoggedOut callled");
    this.props.navigation.navigate("Auth");
  };

  logoutUser = () => {
    let that = this;
    firebase
      .auth()
      .signOut()
      .then(function() {
        if (that._isMounted) {
          // that.setState({
          //   isLoggedOut: true
          // });
          const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: "Auth" })]
          });
          that.props.onlogout();
          that.props.navigation.dispatch(resetAction);
        }
      })
      .catch(function(error) {
        console.log(error);
        alert("error occureed");
      });

    // this.props.onlogout();
  };

  componentDidMount() {
    this._isMounted = true;
    if (this.state.isLoggedOut) {
      this.props.navigation.navigate("Auth");
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (!this.props.isLoggedIn) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return (
      <Drawer style={{ container: {} }}>
        <Drawer.Header
          style={{
            contentContainer: { backgroundColor: "#fff", marginTop: 10 }
          }}
        >
          <Drawer.Header.Account
            avatar={
              <Avatar
                size={80}
                image={
                  <Image
                    source={{ uri: this.props.userProfilePic }}
                    //source={{ uri: "https://picsum.photos/200" }}
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 40,
                      marginLeft: "10%",
                      borderColor: "#eee",
                      borderWidth: 2
                    }}
                  />
                }
                borderRadius={30}
              />
            }
            footer={{
              dense: true,
              centerElement: {
                primaryText: this.props.userName,
                secondaryText: this.props.userEmail
              }
            }}
          />
        </Drawer.Header>
        <Divider inset={true} />
        <Drawer.Section
          divider
          items={[
            {
              icon: "home",
              key: "home",
              value: "Home",
              onPress: () => {
                this.props.navigation.navigate("applicantsList");
                this.props.navigation.dispatch(DrawerActions.closeDrawer());
              }
            },
            {
              icon: "create",
              key: "create",
              value: "Edit Profile",
              onPress: this.editProfileHandler
            },
            {
              icon: "power-settings-new",
              key: "power-settings-new",
              value: "Log out",
              onPress: this.logoutUser
            }
          ]}
        />
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  nameStyle: {
    color: "#fff",
    borderRadius: 5,
    marginBottom: 4,
    padding: 4
  },
  emailStyle: {
    color: "#fff",
    borderRadius: 5,
    textAlign: "left"
  },
  userInfoContainer: {
    paddingTop: 15,
    width: "100%",
    flexDirection: "column",
    marginTop: 6,
    marginRight: 10,
    color: "#fff"
  },
  topContainer: {
    padding: 12,
    flex: 1,
    //flexDirection: "row",
    justifyContent: "space-between",
    height: 200,
    width: "100%",
    marginBottom: 5,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderBottomWidth: 1,
    borderColor: "#000",
    alignSelf: "stretch"
  },
  profilePic: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "red"
  }
});

const mapStateToProps = state => {
  return {
    userEmail: state.clients.user.emailAddress,
    userName: state.clients.user.name,
    userProfilePic: state.clients.user.image,
    userID: state.clients.user.userID,
    isLoggedIn: state.clients.user.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onlogout: () => dispatch(logoutAction())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarScreen);
