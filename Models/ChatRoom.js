const mongoose = require('mongoose');

var ChatRoomSchema = mongoose.Schema({
    roomId : Number,
    participants : [ Number ],
    messages :[{
        messageId : Number,
        senderId : Number,
        time : Date,
        message : String
    }]
});

module.exports = {
    ChatRoom : mongoose.model('ChatRoom',ChatRoomSchema)
}