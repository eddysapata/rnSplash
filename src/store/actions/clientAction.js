import firebase from "react-native-firebase";
import {
  LOGIN_USER,
  GET_ALL_CLIENT_LIST,
  LOGOUT_USER,
  RESET_APP,
  GET_ALL_APPLICANT_LIST
} from "./actionTypes";
import { uiStart, uiEnd } from "./uiAction";
import uploadImage from "../../helperfunction/UploadImage";

import moment from "moment";
import _ from "lodash";

import Snackbar from "react-native-snackbar";

export const tryAuth = (email, password, persistAuth = "false") => {
  return dispatch => {
    const userData = {
      userID: "",
      name: "",
      image: "",
      emailAddress: "",
      isLogged: ""
    };

    if (persistAuth === "true") {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let uid = firebase.auth().currentUser.uid;
          dispatch(getUserData(uid));
        } else {
          return false;
        }
      });
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          let uid = firebase.auth().currentUser.uid;
          dispatch(getUserData(uid));
        })
        .catch(function(error) {
          console.log(error);
          Snackbar.show({
            title: "Wrong Username or Password",
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              title: "OK",
              color: "#e91e63"
            }
          });
          dispatch(uiEnd());
        });
    } //else ends
  };
};

//Applicant Related actions

export const getAllApplicantListAction = allApplicantList => {
  return {
    type: GET_ALL_APPLICANT_LIST,
    allApplicantList
  };
};

export const getAllApplicantList = () => {
  return async dispatch => {
    let db = firebase.firestore();
    let applicantList = [];

    await db
      .collection("clientDetails")
      //.orderBy("name", "desc")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          applicantList.push(doc.data());
        });
      });

    let updatedApplicant = applicantList.map(async item => {
      let clientID = item.clientID;
      let name, image;
      await db
        .collection("clienPersonalInfo")
        .where("clientID", "==", clientID)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let docData = doc.data();
            name = docData.name;
            image = docData.image;

            item.name = name;
            item.image = image;
          });
        });
      return item;
    });

    Promise.all(updatedApplicant).then(completed => {
      dispatch(getAllApplicantListAction(completed));
    });
  };
};

export const logoutAction = () => {
  return {
    type: LOGOUT_USER
  };
};

export const resetAppAction = () => {
  return {
    type: RESET_APP
  };
};

export const loginUserAction = userData => {
  return {
    type: LOGIN_USER,
    userData: userData
  };
};

export const getAllClientListAction = allClientList => {
  return {
    type: GET_ALL_CLIENT_LIST,
    allClientList: allClientList
  };
};

export const newTransaction = transactionData => {
  return async dispatch => {
    let { clientID, date, applicantID } = transactionData;
    let totalAmount = transactionData.totalAmount;

    delete transactionData.clientID;
    delete transactionData.applicantID;
    delete transactionData.totalAmount;

    let currentYear = moment().format("Y");

    let momentDate = moment(date, "DD/MM/YY");
    let momentMonth = momentDate.format("M");

    let collectionName = `transaction${currentYear}`;

    var updatedData = _.mapKeys(transactionData, function(value, key) {
      return key + "_" + momentMonth;
    });

    let db = firebase.firestore();

    await db
      .collection(collectionName)
      .doc(applicantID)
      .set(updatedData, { merge: true })
      .then(function() {
        console.log("INhere done");
        Snackbar.show({
          title: "Transaction Succesfully Done",
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: "OK",
            color: "#e91e63"
          }
        });
      })
      .catch(function(error) {
        dispatch(uiEnd());
        console.error("Error image written: ", error);
      });
  };
};

export const getAllClientList = () => {
  return async dispatch => {
    console.log("getting Data");
    let db = firebase.firestore();
    let clientList = [];

    await db
      .collection("clienPersonalInfo")
      .orderBy("name", "desc")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          clientList.push(doc.data());
        });
      });
    console.log(clientList);
    dispatch(getAllClientListAction(clientList));
  };
};

export const getUserData = uid => {
  return async dispatch => {
    dispatch(getAllClientList());
    dispatch(getAllApplicantList());

    let db = firebase.firestore();
    let userData = {};

    await db
      .collection("userInfo")
      .where("userID", "==", uid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          userData = doc.data();
        });
      });
    dispatch(loginUserAction(userData));
    dispatch(uiEnd());
  };
};

export const addNewApplicant = applicantData => {
  return async dispatch => {
    delete applicantData.submittedByName;

    let db = firebase.firestore();
    let uid = firebase.auth().currentUser.uid;
    await db
      .collection("clientDetails")
      .add(applicantData)
      .then(docRef => {
        var cityRef = db.collection("clientDetails").doc(docRef.id);
        var setWithMerge = cityRef.set(
          {
            applicantID: docRef.id
          },
          { merge: true }
        );

        Snackbar.show({
          title: "Applicant Succesfully Created",
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: "OK",
            color: "#e91e63"
          }
        });

        dispatch(uiEnd());
      })
      .catch(function(error) {
        dispatch(uiEnd());
        console.error("Error adding document: ", error);
      });
  };
};

export const addNewClient = clientData => {
  return async dispatch => {
    let isDefaultImage = clientData.isDefaultImage;
    delete clientData.isDefaultImage;
    delete clientData.docID;

    let db = firebase.firestore();
    let uid = firebase.auth().currentUser.uid;
    await db
      .collection("clienPersonalInfo")
      .add(clientData)
      .then(async docRef => {
        // Toast.show({
        //   text: "Client Succesfully Added",
        //   buttonText: "Okay",
        //   duration: 4000
        // });

        let updateClientID = {
          clientID: docRef.id
        };

        if (!isDefaultImage) {
          let refPathImage = `clients/${docRef.id}`;
          let imageName = "profile_pic";
          imageUri = await uploadImage(
            clientData.image,
            imageName,
            refPathImage
          );

          updateClientID.image = imageUri;
        }

        db.collection("clienPersonalInfo")
          .doc(docRef.id)
          .update(updateClientID)
          .then(function() {
            console.log("Image succesfully written!");
          })
          .catch(function(error) {
            dispatch(uiEnd());
            console.error("Error image written: ", error);
          });

        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        dispatch(uiEnd());
        console.error("Error adding document: ", error);
      });
    dispatch(uiEnd());
    dispatch(getAllClientList());
  };
};

//Update User profile pic and detail
export const updateUserProfile = (username, imageUrl, docID, UID) => {
  return async dispatch => {
    let db = firebase.firestore();
    let loginUserRef = db.collection("userInfo").doc(docID);
    await loginUserRef
      .update({
        name: username,
        image: imageUrl
      })
      .then(function(doc) {
        dispatch(getUserData(UID));
        Snackbar.show({
          title: "Profile Saved Succesfully",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "#4caf50"
        });
        dispatch(uiEnd());
      })
      .catch(function(error) {
        console.error("Error updating document: ", error);
        Snackbar.show({
          title: "Something Went Wrong",
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: "OK",
            color: "#e91e63"
          }
        });
        dispatch(uiEnd());
      });
  };
};
