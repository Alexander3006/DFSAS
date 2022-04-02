'use strict';

const mysql = require('mysql2');
const migration = require('mysql-migrations');
const path = require('path');

const {DatabaseConfig} = require('../../../../config');

const connection = mysql.createPool(DatabaseConfig);

const connectionPromise = connection.promise();

migration.init(connection, path.join(__dirname, '../../../../../migrations'), function () {
  console.log('finished running migrations');
});

module.exports = {
  connection: connectionPromise,
};
