var dbMethods = require('../dbAccess/dbMethods');
var validator = require('validator');
var express = require('express');
var app = express();

app.set("view engine", "jade")

function getList(req, res, callback) {
    var query = "select emp_id,emp_name,emp_gen,dob,p_email,s_mail,phone_number,skills,tot_exp_yr, tot_exp_mon from test.employees ";
    var empId;
    if (!validator.isEmpty(req.body.empId)) {
        empId = parseInt(req.body.empId);
        query = query + " where emp_id=" + empId;
    }
    query = query + " order by emp_name";
    dbMethods.executeSql(query, callback);
};

function insertData(req, res) {
    var empName = req.body.empName;
    var empGen = req.body.gen;
    var dob = req.body.dob;
    var pEmail = req.body.pemail;
    var sEmail = req.body.semail;
    var phNum = parseInt(req.body.phNum);
    var skills = req.body.skills;
    var totExpYr = parseInt(req.body.yrs);
    var totExpMon = parseInt(req.body.mon);
    var imgPath = '';
    var filePath = '';
    var imgname = req.body.photo;
    var fileName = req.body.resume;
    var sql = "insert into employees (emp_name,emp_gen,dob,p_email,s_email,phone_number,skills,tot_exp_yr,tot_exp_mon,img_path,file_path,image_name,file_name,created_date,email_flag) values ('" + empName + "','" + empGen + "','" + dob + "','" + pEmail + "','" + sEmail + "'," + phNum + ",'" + skills + "'," + totExpYr + "," + totExpMon + ",'" + imgPath + "','" + filePath + "','" + imgname + "','" + fileName + "',sysdate(),'N')";
    dbMethods.executeSql(sql, function (err, data) {
        if (data != undefined || data != null) {
            if (data.affectedRows > 0) {
                res.render('D:\\Tutorial\\NodeJs\\NodeWebSite\\view\\error.jade', { error: { result: 'Date inserted successfully', title: 'Employee Information' } });
            } else {
                res.render('D:\\Tutorial\\NodeJs\\NodeWebSite\\view\\error.jade', { error: { result: 'Date inserted successfully', title: 'Employee Information' } });
            }
        } else {
            res.render('D:\\Tutorial\\NodeJs\\NodeWebSite\\view\\error.jade', { error: { result: 'Technical error occured.', title: 'Employee Information' } });
        }
    });
}

module.exports = {
    getList: getList,
    insertData: insertData
}