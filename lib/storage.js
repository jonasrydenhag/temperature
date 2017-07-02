'use strict';

var debug = require('debug')('tempHum/storage');
var firebase = require('firebase-admin');

var serviceAccount = require('../hagarasp-firebase-adminsdk-6bylk-06c217afd2.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://hagarasp.firebaseio.com'
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
