#!/usr/bin/env node

'use strict';

var debug = require('debug')('tempHum');
var Promise = require('promise');
var storage = require('./lib/storage');

function storeTempHum (temperature, humidity) {
  return new Promise(function (resolve, reject) {
    storage.store(temperature, humidity)
      .then(function () {
        resolve();
      })
      .catch(function (ex) {
        reject(ex);
      });
  });
}

(function(){
  module.exports.store = storeTempHum;

  if (module.parent === null) {
    var args = process.argv.slice(2);

    storeTempHum(parseFloat(args[0]), parseFloat(args[1]))
      .then(function () {
        process.exit();
      })
      .catch(function (ex) {
        debug(ex);
        process.exit(1);
      });
  }
})();
