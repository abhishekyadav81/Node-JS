var dataAccess = require('./dbAccess/dataAccess.js');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var http = require('http');
var express = require('express');
var session = require('express-session');
var bcrypt= require('bcrypt');

//var cookieParser = require('cookie-parser')

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

app.use(session({
    key: 'user_sid',
    secret: 'somerandomstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 172800
    }
}));

 
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    if (req.session && req.session.user != null)
      return next();
    else
      //return res.sendStatus(401);
      res.render(__dirname + '\\view\\login.jade',{logInFailed: false});
  };
   
  // Login endpoint
  /*app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.render(__dirname + '\\view\\login.jade',{logInFailed: true});
    } else if(req.body.username === "abhi" && req.body.password === "password") {
      req.session.user = "abhi";
      res.render(__dirname + '\\view\\home.jade');
    } else {
        res.render(__dirname + '\\view\\login.jade', {logInFailed: true} );
    }
  });*/

  // Login endpoint
  app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.render(__dirname + '\\view\\login.jade',{logInFailed: true});
    }     
    var callback = function (err, data) {

        //data will have the hashed password

        bcrypt.compare(req.body.password, data[0].password).then(function(loginResult) {
            if (loginResult == true) {
                req.session.user = req.body.username;
                res.render(__dirname + '\\view\\home.jade');
            } else {
                res.render(__dirname + '\\view\\login.jade', {logInFailed: true} );
            }
        })
        .catch(function (error) {
            console.log(error.message);
            res.render(__dirname + '\\view\\login.jade', {logInFailed: true} );
        });
        
    }
        dataAccess.findUser(req, res, callback);
    });
    

  // Logout endpoint
  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.render(__dirname + '\\view\\login.jade',{logInFailed: false} );
  });

app.get("/",function (req, res) {
    if (req.session && req.session.user != null){
        res.render(__dirname + '\\view\\home.jade');
    } else {
        res.render(__dirname + '\\view\\login.jade',{logInFailed: false} );
    }
});

app.get("/createUser", auth,function (req, res) {
    res.render(__dirname + "\\view\\inputEmpInfo.html");
});

var flag = 'error';

app.post("/inputEmpInfo",auth, function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        
        var oldpath = files.image.path;
        var newpath = 'D:/Upload/Images/' + files.image.name;

        uploadFile(oldpath, newpath,res);
        var oldpathresumefile = files.resume.path;
        var newpathresumefile = 'D:/Upload/Resume/' + files.resume.name;
        uploadFile(oldpathresumefile, newpathresumefile,res);

        if (flag=== 'ok') {
            var callback = function (err, data) {
                if (data != undefined || data != null) {
                    if (data.affectedRows > 0) {
                        res.render(__dirname+'\\view\\error.jade', { error: { result: 'Date inserted successfully', title: 'Employee Information' } });
                    } else {
                        res.render(__dirname+'\\view\\error.jade', { error: { result: 'Date inserted successfully', title: 'Employee Information' } });
                    }
                } else {
                    console.log('Error with SQL Execution '+err);
                    res.render(__dirname+'\\view\\error.jade', { error: { result: 'Technical error occured.', title: 'Employee Information' } });
                }
            }
            dataAccess.insertData(fields,files,res,callback);
        }
    });
});


app.post("/searchEmpInfo", auth, (req, res) => {
    var callback = function (err, data) {
        if (data != undefined) {
            console.log(data.length);
            if (data.length > 1)
                res.render(__dirname + '\\view\\display.jade', { result: data });
            else if (data.length == 1)
                res.render(__dirname + '\\view\\displayOneEmp.jade', { result: data });
            else
                res.render(__dirname + '\\view\\error.jade', { error: { result: 'No data found', title: 'Employee Information' } });
        } else {
            res.render(__dirname + '\\view\\error.jade', { error: { result: 'No data found', title: 'Employee Information' } });
        }
    };
    dataAccess.getList(req, res, callback);
})


app.get('/images/:imageFileName', auth, function(req, res) {
    console.log("imageFileName is set to " + req.params.imageFileName);
    res.sendFile(path.resolve('D:/Upload/Images/'+req.params.imageFileName));
  });

  app.get('/resume/:resumeFileName', auth, function(req, res) {
    console.log("resumeFileName is set to " + req.params.resumeFileName);
    res.sendFile(path.resolve('D:/Upload/Resume/'+req.params.resumeFileName));
  });
  

app.get("/searchInfo", auth, function (req, res) {
    res.render(__dirname + '\\view\\searchEmpInfo.html');
});

http.createServer(app).listen(3000, function (req, res) {
    console.log('Server connected.');
});

function uploadFile(oldpathfile, newpathfile,res) {
    const fileKiloByteSize = (fs.statSync(oldpathfile).size) * 0.001;
    if (fileKiloByteSize > 100) {
        flag = 'error';
        console.log('Uploaded file exceeds limit of 100KB.');
        res.render(__dirname + '\\view\\inputEmpInfo.html', { result: 'Uploaded file exceeds limit of 100KB.' });
    } else {
        flag = 'ok';
    }

    // Read the file
    fs.readFile(oldpathfile, function (err, data) {
        if (err) {
            flag = 'error';
            throw err;
        }

        // Write the file
        fs.writeFile(newpathfile, data, function (err) {
            if (err) {
                flag = 'error';
                throw err;
            }
            // Delete the file
            fs.unlink(oldpathfile, function (err) {
                if (err) {
                    flag = 'error';
                    throw err;
                }

            });
        });
    });

}

