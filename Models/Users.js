const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    userId : Number,
    name : String,
    email : String,
    phone : String,
    password : String,
});

const User = mongoose.model('user',UserSchema);

const isEmailExist = async (email)=>{
    const data = await User.findOne({email:email},{email:1});
    if(data){
        return true;
    }
    else{
        return false;
    }
}

const addNewUser = async (req)=>{
    var newUser = new User({
        userId : await User.countDocuments({}) + 1,
        name : req.name,
        email : req.email,
        phone : req.phone,
        password : req.password
    })
    return newUser.save()
        .then((usr) => {
            return {status:200, data:usr};
        })
        .catch(err => {
            return {status:400, data:err};
        });
}

const getUserByEmail = async(email)=>{
    return User.findOne({email:email},{password:1,userId:1});
}

const getAllUsers = async()=>{
    return User.find({},{password:0});
}

module.exports = {
    User : User,
    isEmailExist: isEmailExist,
    addNewUser : addNewUser,
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers
}