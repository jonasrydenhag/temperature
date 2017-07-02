#!/usr/bin/env node

'use strict';

var debug = require('debug')('tempHum');
var Promise = require('promise');
var sensor = require('node-dht-sensor');
var storage = require('./lib/storage');

var sensorGpio = 4;

function read () {
  return new Promise(function (resolve, reject) {
    sensor.read(22, sensorGpio, function(err, temperature, humidity) {
      if (!err) {
        resolve({
          "temperature": temperature,
          "humidity": humidity
        });
      } else {
        reject(err);
      }
    });
  });
}

function readAndStore () {
  return new Promise(function (resolve, reject) {
    read()
      .then(function (tempHum) {
        storeTempHum(tempHum)
          .then(function () {
            resolve(tempHum);
          })
          .catch(function (ex) {
            reject(ex);
          });
      })
      .catch(function (ex) {
        reject(ex);
      });
  });
}

function storeTempHum (tempHum) {
  return new Promise(function (resolve, reject) {
    storage.store(tempHum)
      .then(function () {
        resolve();
      })
      .catch(function (ex) {
        reject(ex);
      });
  });
}

(function(){
  module.exports.read = read;
  module.exports.readAndStore = readAndStore;

  if (module.parent === null) {
    readAndStore()
      .then(function (tempHum) {
        debug(tempHum);
        console.log('Temperature: ' + tempHum.temperature.toFixed(1) + '°C, ' +
          'Humidity: ' + tempHum.humidity.toFixed(1) + '%');

        process.exit();
      })
      .catch(function (ex) {
        debug(ex);
        console.log(ex);
        process.exit(1);
      });
  }
})();
