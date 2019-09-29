/**
 * @eddysapata
 */
import firebase from "react-native-firebase";

const uploadImage = async (
  uploadUri,
  imageName,
  refpath,
  mime = "image/jpeg"
) => {
  const imageRef = firebase
    .storage()
    .ref(refpath)
    .child(imageName);

  let downloadUrl = "";
  await imageRef.put(uploadUri, { contentType: mime });
  await imageRef.getDownloadURL().then(function(url) {
    downloadUrl = url;
  });

  return downloadUrl;
};

export default uploadImage;
