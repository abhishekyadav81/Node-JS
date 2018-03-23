var assert= require('chai').assert;
var dataAccess= require('../dbAccess/dataAccess');

describe('Second', function(){
    it('It should return employee for  given userName', function(){
        dataAccess.findUser('mailtoabhi.yadav@gmail.com', function verifyData(data){
           assert.isNotEmpty(data.password);
        });
   });
});




