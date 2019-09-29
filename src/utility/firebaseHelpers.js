import firebase from "react-native-firebase";

const db = firebase.firestore();

export const getNameByID = async id => {
  let userData = {};

  await db
    .collection("userInfo")
    .where("userID", "==", id)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(doc => {
        userData = doc.data();
      });
    });
  return userData;
};
