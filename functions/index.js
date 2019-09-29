const functions = require("firebase-functions");
const admin = require("firebase-admin");

const cors = require("cors")({ origin: true });
//const moment = require("moment");

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

var sendNotification = function(message) {
  var name = message.name;
  var monthlyInstallment = message.monthlyInstallment;
  var data = {
    app_id: "70a59c6d-e3fa-4324-ae0c-27e912b4e849",
    included_segments: ["All"],
    contents: { en: name + ' :'+ monthlyInstallment },
    template_id: "995d8699-2e31-4356-a2e7-e37543e920f6",
    android_channel_id: "fc64094f-d752-4c79-8456-6d5ddaea65e3"
  };

  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic MDdkMjE4NTAtYWY5OC00ZjkwLWJiNmEtYzcyMmY0MGU3MDMw"
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var https = require("https");
  var req = https.request(options, res => {
    res.on("data", data => {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on("error", e => {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

exports.sendDailyNotifications = functions.https.onRequest(
  (request, response) => {
    cors(request, response, () => {
      admin
        .firestore()
        .collection("clientDetails")
        //.where("clientID", "==", "wOqkjYYz3t7qQzHJ1kgu")
        .get()
        .then(querySnapshot => {
          const promises = [];
          querySnapshot.forEach(doc => {
            let clientObject = {};
            clientObject.name = doc.data().name;
            clientObject.monthlyInstallment = doc.data().monthlyInstallment;
            promises.push(clientObject);
          });

          return Promise.all(promises);
        }) //below code for notification
        .then(results => {
          response.send(results);
          let i = 0;
          results.forEach(user => {
            if(i===0){
              sendNotification(user);
            }
            i++;
          });
          return "";
        })
        .catch(error => {
          console.log(error);
          response.status(500).send(error);
        });
    });
  }
);
