const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    userId : Number,
    name : String,
    email : String,
    phone : String,
    password : String,
});

module.exports = {
    User : mongoose.model('user', UserSchema)
}