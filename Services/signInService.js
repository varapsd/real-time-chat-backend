const { getUserByEmail } = require('../Models/Users');
const SignInService = async(req)=>{
    var resObj = {
        isSuccess: false,
        userId : null
    }
    const responseDto = await getUserByEmail(req.email);
    if(responseDto && responseDto.password === req.password){
        resObj.isSuccess = true;
        resObj.userId = responseDto.userId;
    }
    return resObj;
}

module.exports = {
    SignInService : SignInService
}