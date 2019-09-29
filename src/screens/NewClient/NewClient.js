import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  BackHandler
} from "react-native";

import { Toolbar } from "react-native-material-ui";
import { uiStart, uiEnd } from "../../store/actions/index";

import { Container, Content } from "native-base";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";

import firebase from "react-native-firebase";

import { Thumbnail, Root, ActionSheet, Toast } from "native-base";
import { TextField } from "react-native-material-textfield";

import { updateUserProfile, addNewClient } from "../../store/actions/index";
import uploadImage from "../../helperfunction/UploadImage";

import { Dropdown } from "react-native-material-dropdown";

let defaultImagePath = "";

class NewClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientID: "",
      name: "",
      contactNum: "",
      alternateNum: "",
      address: "",
      email: "",
      documentType: "",
      documentNo: "",
      chequeNum: "",
      chequeImage: "",
      image: ""
    };
    this.baseState = this.state;
  }

  onSaveProfile = async () => {
    this.props.loadingStart();
    var currentState = this.state;

    if (this.state.image !== "") {
      currentState.image = this.state.image;
      currentState.isDefaultImage = false;
    } else {
      currentState.image = defaultImagePath;
      currentState.isDefaultImage = true;
    }
    await this.props.onAddNewClient(currentState);
    this.setState(this.baseState);
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

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  async componentWillMount() {
    let storage = firebase.storage();
    let pathReference = storage.ref(
      "defaultPics/userDefaultPic/profile_pic.jpg"
    );
    defaultImagePath = await pathReference.getDownloadURL();
    this.setState(prevState => prevState);
  }

  async componentDidMount() {
    this.getDocumentID();
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  changeLoader = () => {
    this.setState(prevState => {
      return {
        isLoading: prevState.isLoading ? false : true
      };
    });
  };

  render() {
    let imagePath = this.state.image || defaultImagePath;
    let loader = <ActivityIndicator color="#fff" size={25} />;
    let selectDocumentType = [
      { value: "Aadhar Card" },
      { value: "Voter ID" },
      { value: "Driving License" },
      { value: "PAN Card Number" },
      { value: "Other" }
    ];

    return (
      <Root>
        <Container>
          <Toolbar
            isEditProfileTab={true}
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigation.goBack()}
            rightElement={this.props.isLoading ? loader : "check"}
            centerElement="New Client"
            onRightElementPress={this.onSaveProfile}
          />
          <Content>
            <ScrollView style={styles.mainContainer}>
              <KeyboardAvoidingView>
                <View style={styles.avatarContainer}>
                  <Thumbnail large source={{ uri: imagePath }} defaultSource={require('../../images/profile_pic.jpg')} />
                  <TouchableNativeFeedback
                    useForeground={true}
                    onPress={this.changeDpHandler}
                  >
                    <View style={styles.editPicStyle}>
                      <Text>Edit Profile Pic!</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
                <View style={styles.textInputStyle}>
                  <TextField
                    label="User Name"
                    value={this.state.name}
                    animationDuration={255}
                    onChangeText={name => this.setState({ name })}
                  />
                  <TextField
                    label="Contact Number"
                    value={this.state.contactNum}
                    animationDuration={255}
                    keyboardType="number-pad"
                    onChangeText={contactNum => this.setState({ contactNum })}
                  />
                  <TextField
                    label="Alternate Number"
                    value={this.state.alternateNum}
                    animationDuration={255}
                    keyboardType="number-pad"
                    onChangeText={alternateNum =>
                      this.setState({ alternateNum })
                    }
                  />
                  <TextField
                    label="Address"
                    value={this.state.address}
                    animationDuration={255}
                    onChangeText={address => this.setState({ address })}
                  />
                  <TextField
                    label="Email Address"
                    value={this.state.email}
                    animationDuration={255}
                    keyboardType="email-address"
                    onChangeText={email => this.setState({ email })}
                  />
                  <Dropdown
                    label="Document Type"
                    data={selectDocumentType}
                    onChangeText={documentType =>
                      this.setState({ documentType })
                    }
                    value={this.state.documentType}
                  />
                  <TextField
                    label="Document No."
                    value={this.state.documentNo}
                    animationDuration={255}
                    onChangeText={documentNo => this.setState({ documentNo })}
                  />
                  <TextField
                    label="Cheque Number"
                    value={this.state.chequeNum}
                    keyboardType="number-pad"
                    animationDuration={255}
                    onChangeText={chequeNum => this.setState({ chequeNum })}
                  />
                </View>
              </KeyboardAvoidingView>
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
    userID: state.clients.user.userID,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddNewClient: clientData => dispatch(addNewClient(clientData)),
    loadingStart: () => dispatch(uiStart()),
    loadingStop: () => dispatch(uiEnd())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewClient);
