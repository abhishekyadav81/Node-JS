var nodemailer = require('nodemailer');
var dbMethods = require('../dbAccess/dbMethods');
var bcrypt = require('bcrypt');

function interval(args) {
   getEmailList(args);
}

function getEmailList(arg) {

    var query = "select emp_id,emp_name,p_email,date_format(date(created_date),'%d %M %Y') "+
    " created_date,password from employees where email_flag='N' and p_email='"+arg[0]+"'" ;

    dbMethods.executeSql(query,function(err,data){
        if(data != null && data.length > 0){
            bcrypt.compare(arg[1], data[0].password).then(function(result) {
                if (result == true) {
                    var dtl = JSON.stringify(data);
                    var val = JSON.parse(dtl);
                    var sub = val[0].emp_name+" user created.";
                    var emailMsg = "Dear "+val[0].emp_name+" (Employee id: "+val[0].emp_id+"), Your user id has been created on "+val[0].created_date+".";
                    var fromId = "mailtoabhi.yadav@gmail.com";
                    var toId = val[0].p_email;
                    emailSend(val[0].emp_id,sub,emailMsg,fromId,toId);
                } 
            })
            .catch(function (error) {
                console.log(error.message);
            });
        }
    });    
}

function emailSend(empId,sub,emailMsg,fromId,toId) {
  var transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: fromId,
            pass: ''
        }
    });

    var mailOpts = {
        from: fromId,
        to: toId,
        subject: sub,
        text: emailMsg
    };

    transporter.sendMail(mailOpts,function(error,info){
        if(error) {
            return console.log(error);
        } else {
            console.log("Email sent successfully.");
            updateEmailStatus(empId);
        }
    });
};

function updateEmailStatus(empId) {
    var query = "update employees set email_flag='Y',email_date=sysdate() where emp_id="+empId;
    dbMethods.executeSql(query,function(err,data){
        if(err) {
            return console.log(err);
        } else {
            console.log("Data updated successfully.");
        }
    }); 
}

module.exports = {
    interval: interval
};