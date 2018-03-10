/*var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/DevDB';

mongoClient.connect(url,function(err,db) {
    createDocuments(db,function(){
        console.log('Connected');
        db.close();
    });
});

var createDocuments = function(db,callback) {
    var collection = db.employee;
    collection.insert([
        {"Employee Id":1901,"Employee Name": "Dipesh Jain"}
    ],function(err,result) {
        callback(result);
    });
}*/