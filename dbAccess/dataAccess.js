var dbMethods = require('../dbAccess/dbMethods');
var validator = require('validator');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');
var emailSchedular = require('../util/emailHandling');


function findUser(userName, callback) {
    console.log('userName is '+userName);
    var query = "select password from test.employees where p_email='"+userName+"'";
    dbMethods.executeSql(query, callback);
};



function getList(empId,  callback) {
    console.log('Emp ID is '+empId);
    var query = "select emp_id,emp_name,emp_gen,dob,p_email,s_mail,phone_number,skills,tot_exp_yr, tot_exp_mon,image_name,file_name from test.employees ";
    if (!validator.isEmpty(empId)) {
        empId = parseInt(empId);
        query = query + " where emp_id=" + empId;
    }
    query = query + " order by emp_name";
    dbMethods.executeSql(query, callback);
};


function insertData(fields,files,callback) {
    var empName = fields.empName;
    var empGen = fields.gen == 'Male' ? 'M':'F';
    if(fields.gen == 'Transgender'){
        empGen='T';
    }
    var dob = fields.dob;
    var pEmail = fields.pemail;
    var sEmail = fields.semail;
    var phNum = parseInt(fields.phNum);
    var skills = fields.skills;
    var totExpYr = parseInt(fields.yrs);
    var totExpMon = parseInt(fields.mon);
    var imgPath = 'D:/Upload/Resume/';
    var filePath = 'D:/Upload/Images/';
    var imgname = files.image.name;
    var fileName = files.resume.name;
    var password = randomstring.generate({length: 8,charset: 'alphabetic'});
    console.log('generated password =' +password);
    bcrypt.hash(password, 10, function(err, hash) {
        console.log('generated hash =' +hash);
        var sql = "insert into employees (emp_name,emp_gen,dob,p_email,s_mail,phone_number,skills,tot_exp_yr,tot_exp_mon,img_path,file_path,image_name,file_name,created_date,email_flag,password) values ('" + empName + "','" + empGen + "','" + dob + "','" + pEmail + "','" + sEmail + "'," + phNum + ",'" + skills + "'," + totExpYr + "," + totExpMon + ",'" 
        + imgPath + "','" + filePath + "','" + imgname + "','" + fileName + "',sysdate(),'N','" +hash+"')";
        dbMethods.executeSql(sql,callback);
        var args = [ pEmail, password ];
        setInterval(emailSchedular.interval,60000,args);                    
      });
}

module.exports = {
    getList: getList,
    insertData: insertData,
    findUser : findUser
}