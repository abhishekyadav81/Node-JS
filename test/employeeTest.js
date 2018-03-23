var assert= require('chai').assert;
var dataAccess= require('../dbAccess/dataAccess');

describe('First', function(){
    it('It should return employee for the Id', function(){
         dataAccess.getList('2', function verifyResult(result){
            assert.equal('Abhishek Yadav',result.emp_name);
         });
    });

/*    it('It should return employee for  given userName', function(){
        dataAccess.findUser('mailtoabhi.yadav@gmail.com', function verifyData(data){
           assert.isNotEmpty(data.password);
        });
   });*/
   
});




