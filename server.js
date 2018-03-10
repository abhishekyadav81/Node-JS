var dataAccess = require('./model/dataAccess.js');
var emailSchedular = require('./model/emailHandling.js');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var http = require('http');
var express = require('express');
var path = require('path');
var validator = require('validator');
var fs = require('fs');
var formidable = require('formidable');
var imgSize = require('image-size');
var app = express();


app.engine('html', engines.mustache);
app.set('view engine', 'jade');
app.set('views', 'view');
app.use(express.static(path.join(__dirname, 'view')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    res.render(__dirname + '\\view\\home.jade');
});

app.get("/createUser", function (req, res) {
    res.render(__dirname + "\\view\\inputEmpInfo.html");
});

app.post("/inputEmpInfo", function (req, res) {
    var flag='error';
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.image.path;
     const fileKiloByteSize = (fs.statSync(oldpath).size) * 0.001;
     if (fileKiloByteSize > 100) {
         flag = 'error';
         console.log('Uploaded file exceeds limit of 100KB.');
         res.render(__dirname+'\\view\\inputEmpInfo.html', { result: 'Uploaded file exceeds limit of 100KB.' });
     } else {
         flag = 'ok';
     }
      

      var newpath = 'D:/Upload/Images/' + files.image.name;

    // Read the file
    fs.readFile(oldpath, function (err, data) {
        if (err) throw err;
       
        // Write the file
        fs.writeFile(newpath, data, function (err) {
            if (err) throw err;
            // Delete the file
            fs.unlink(oldpath, function (err) {
                if (err) throw err;
            });
        });
    });
      
     var oldpathresumefile = files.resume.path;
     var newpathresumefile = 'D:/Upload/Resume/' + files.resume.name;

// Read the file
    fs.readFile(oldpathresumefile, function (err, data) {
        if (err) throw err;

    // Write the file
        fs.writeFile(newpathresumefile, data, function (err) {
        if (err) throw err;
        // Delete the file
        fs.unlink(oldpathresumefile, function (err) {
            if (err) throw err;
        });
    });
});

    });
});

    // var flag;
    // const fileKiloByteSize = (fs.statSync('D:\\Upload\\' + req.body.resume).size) * 0.001;
    // if (fileKiloByteSize > 100) {
    //     flag = 'error';
    //     console.log('Uploaded file exceeds limit of 100KB.');
    //     res.render(__dirname+'\\view\\inputEmpInfo.html', { result: 'Uploaded file exceeds limit of 100KB.' });
    // } else {
    //     flag = 'ok';
    // }
    // const imgFileKiloByteSize = (fs.statSync('D:\\Upload\\' + req.body.photo).size) * 0.001;
    // var dim = imgSize('D:\\Upload\\' + req.body.photo);
    // if (dim.width > 200 && dim.height > 174 && imgFileKiloByteSize > 30) {
    //     flag = 'error';
    //     console.log('Uploaded image dimensions exceed limit.');
    //     res.render(__dirname+'\\view\\inputEmpInfo.html', { result: 'Uploaded image dimensions exceed limit.' });
    // } else {
    //     flag = 'ok';
    // }
    // if (validator.equals(flag, 'ok')) {
    //     dataAccess.insertData(req, res);
    // }


app.post("/searchEmpInfo",  (req, res) => {
    var callback = function (err, data) {
        if (data != undefined) {
            console.log(data.length);
            if (data.length > 1)
                res.render(__dirname+'\\view\\display.jade', { result: data });
            else if(data.length == 1)
                res.render(__dirname+'\\view\\displayOneEmp.jade', { result: data });
             else 
                res.render(__dirname+'\\view\\error.jade', { error: { result: 'No data found', title: 'Employee Information' } });    
        } else {
            res.render(__dirname+'\\view\\error.jade', { error: { result: 'No data found', title: 'Employee Information' } });
        }
    };
    dataAccess.getList(req, res, callback);
})

app.get("/searchInfo", function (req, res) {
    res.render(__dirname + '\\view\\searchEmpInfo.html');
});

http.createServer(app).listen(3000, function (req, res) {
    console.log('Server connected.');
});