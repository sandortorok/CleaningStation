var mysql = require("mysql");
var db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "Sanyi",
  password: "sakkiraly11",
  database: "cleaningStation",
  multipleStatements: true,
  socketPath: '/var/run/mysqld/mysqld.sock'

});

module.exports = db;
