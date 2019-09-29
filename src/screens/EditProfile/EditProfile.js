import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  ActivityIndicator,
  Button
} from "react-native";

import { Toolbar } from "react-native-material-ui";
import { uiStart, uiEnd } from "../../store/actions/index";

import { DrawerActions } from "react-navigation";

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content
} from "native-base";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";

import firebase from "react-native-firebase";

import { Thumbnail, Root, ActionSheet, Toast } from "native-base";
import { TextField } from "react-native-material-textfield";

import { updateUserProfile } from "../../store/actions/index";
import uploadImage from "../../helperfunction/UploadImage";

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      image: "",
      clicked: "",
      docID: ""
    };
  }

  SnackbarTest = () => {};

  onSaveProfile = async () => {
    this.props.loadingStart();
    var imageUri = this.props.userProfilePic;
    if (this.state.image !== "") {
      //will need uploadImage function
      let refPathImage = `users/${this.props.userID}`;
      let imageName = "profile_pic";
      imageUri = await uploadImage(this.state.image, imageName, refPathImage);
      console.log("imageUri", imageUri);
    }
    this.props.onUpdateUserProfile(
      this.state.name,
      imageUri,
      this.state.docID,
      this.props.userID
    );
  };

  getDocumentID = async () => {
    let db = firebase.firestore();
    let documentId;
    await db
      .collection("userInfo")
      .where("userID", "==", this.props.userID)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          documentId = doc.id;
          console.log(doc.id);
        });
      });
    this.setState({
      docID: documentId
    });
  };

  pickImage(option) {
    switch (option) {
      case 0:
        ImagePicker.openCamera({
          width: 640,
          height: 640,
          cropping: true
        }).then(image => {
          this.setState({
            image: image.path
          });
        });
        break;
      case 1:
        ImagePicker.openPicker({
          width: 640,
          height: 640,
          cropping: true
        }).then(image => {
          console.log(image);
          this.setState({
            image: image.path
          });
        });
        break;
      default:
        return false;
    }
  }

  changeDpHandler = () => {
    let BUTTONS = ["Select from Camera", "Select from Gallery", "Cancel"];
    const CANCEL_INDEX = 2;
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: "Pick Image"
      },
      buttonIndex => {
        this.pickImage(buttonIndex);
      }
    );
  };

  componentDidMount() {
    this.setState({
      name: this.props.userName,
      email: this.props.userEmail
    });
    console.log("here", this.props);
    this.getDocumentID();
  }

  changeLoader = () => {
    this.setState(prevState => {
      return {
        isLoading: prevState.isLoading ? false : true
      };
    });
  };

  render() {
    let imagePath = this.state.image || this.props.userProfilePic;
    let loader = <ActivityIndicator color="#fff" size={25} />;
    return (
      <Root>
        <Container>
          <Toolbar
            isEditProfileTab={true}
            leftElement="menu"
            onLeftElementPress={() =>
              this.props.navigation.dispatch(DrawerActions.openDrawer())
            }
            rightElement={this.props.isLoading ? loader : "check"}
            centerElement="Edit Profile"
            onRightElementPress={this.onSaveProfile}
          />
          <Content>
            <ScrollView style={styles.mainContainer}>
              <View style={styles.avatarContainer}>
                <Thumbnail large source={{ uri: imagePath }} />
                <TouchableNativeFeedback
                  useForeground={true}
                  onPress={this.changeDpHandler}
                >
                  <View style={styles.editPicStyle}>
                    <Text>Edit Profile Pic!</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View>
                <View style={styles.textInputStyle}>
                  <TextField
                    label="User Name"
                    value={this.state.name}
                    animationDuration={255}
                    onChangeText={name => this.setState({ name })}
                  />
                  <TextField
                    label="Email"
                    disabled={true}
                    value={this.state.email}
                    animationDuration={255}
                    onChangeText={email => this.setState({ email })}
                  />
                </View>
              </View>
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
    marginTop: 10
  },
  textInputStyle: {
    padding: 10
  },
  avatarContainer: {
    flex: 1,
    alignItems: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 1
  },
  editPicStyle: {
    margin: 10,
    backgroundColor: "#eee",
    padding: 4,
    color: "#000",
    fontWeight: "bold",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#eee"
  }
});

const mapStateToProps = state => {
  return {
    userEmail: state.clients.user.emailAddress,
    userName: state.clients.user.name,
    userProfilePic: state.clients.user.image,
    userID: state.clients.user.userID,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateUserProfile: (username, imageUrl, docID, UID) =>
      dispatch(updateUserProfile(username, imageUrl, docID, UID)),
    loadingStart: () => dispatch(uiStart()),
    loadingStop: () => dispatch(uiEnd())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileScreen);
