var dbMethods = require('../dbAccess/dbMethods');
var validator = require('validator');



function getList(req, res, callback) {
    var query = "select emp_id,emp_name,emp_gen,dob,p_email,s_mail,phone_number,skills,tot_exp_yr, tot_exp_mon,image_name,file_name from test.employees ";
    var empId;
    if (!validator.isEmpty(req.body.empId)) {
        empId = parseInt(req.body.empId);
        query = query + " where emp_id=" + empId;
    }
    query = query + " order by emp_name";
    dbMethods.executeSql(query, callback);
};


function insertData(fields,files,res,callback) {
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
    var sql = "insert into employees (emp_name,emp_gen,dob,p_email,s_mail,phone_number,skills,tot_exp_yr,tot_exp_mon,img_path,file_path,image_name,file_name,created_date,email_flag) values ('" + empName + "','" + empGen + "','" + dob + "','" + pEmail + "','" + sEmail + "'," + phNum + ",'" + skills + "'," + totExpYr + "," + totExpMon + ",'" + imgPath + "','" + filePath + "','" + imgname + "','" + fileName + "',sysdate(),'N')";
    dbMethods.executeSql(sql,callback);
}

module.exports = {
    getList: getList,
    insertData: insertData
}