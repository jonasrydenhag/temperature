'use strict';

var config = require('../config.json');
var debug = require('debug')('tempHum/storage');
var firebase = require('firebase-admin');

var serviceAccount = require('../firebase-account.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL
});

var db = firebase.database();
var tempHumRef = db.ref("tempHum");

function pushTempHum(tempHum) {
  return tempHumRef
    .push({
      temperature: tempHum.temperature,
      humidity: tempHum.humidity,
      createDate: firebase.database.ServerValue.TIMESTAMP
    });
}

module.exports = {
  store: pushTempHum
};
