const {isEmailExist, addNewUser} = require('../Models/Users');

const signUpService = async(req)=>{
    var resObj = {
        isSuccess : false,
        message : ""
    }
    if(await isEmailExist(req.email)){
        resObj.isSuccess = false;
        resObj.message = "email already exists"
        return resObj;
    }
    const responseDto = await addNewUser(req);
    if(responseDto.status == 200){
        resObj.isSuccess = true;
        resObj.message = "Successfully added";
    }
    else{
        resObj.isSuccess = false;
        resObj.message = responseDto.data;
    }
    return resObj;
}

module.exports = {
    signUpService : signUpService
}