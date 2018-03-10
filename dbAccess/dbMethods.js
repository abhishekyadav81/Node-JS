var mysql = require("mysql");
var MongoClient = require('mongodb').MongoClient;
var settings = require("../dbAccess/dbSettings");

exports.executeSql = function (sql, callback) {
    var conn = mysql.createConnection(settings.dbConfig);
    conn.connect();
    conn.query(sql, callback);
    conn.end();
}; 