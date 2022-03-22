const getAllUsers = require('../Models/Users').getAllUsers;
const GetUsersService = async(res)=>{
    var responseDto = await getAllUsers();
    return responseDto;
}

module.exports = {
    GetUsersService : GetUsersService
}