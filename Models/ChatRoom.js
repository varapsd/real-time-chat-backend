const mongoose = require('mongoose');

var ChatRoomSchema = mongoose.Schema({
    roomId : Number,
    participants : [ Number ],
    messages :[{
        messageId : Number,
        senderId : Number,
        time : Date,
        message : String,
        messageType : String,
        fileBuffer : String,
        fileName : String,
        privateKey : String,
        bufLength : Number
    }]
});

const ChatRoom = mongoose.model('ChatRoom',ChatRoomSchema);
const addChat = async (payload)=>{
    const validRoom = await ChatRoom.findOne({roomId : payload.roomId});
    var message = {
        messageId : validRoom.messages.length + 1,
        senderId : payload.userId,
        time : new Date(),
        message : payload.message
    }
    validRoom.messages.push(message);
    return validRoom.save()
        .then((room) => {
            return {status:200, data:room};
        })
        .catch(err => {
            return {status:400, data:err};
        });
}

const addFile = async (payload) => {
    const validRoom = await ChatRoom.findOne({roomId : payload.roomId});
    var message = {
        messageId : validRoom.messages.length + 1,
        senderId : payload.userId,
        time : new Date(),
        messageType : "multimedia",
        fileBuffer : payload.chiphertext,
        privateKey : payload.privateKey,
        fileName : payload.fileName,
        bufLength : payload.bufLength
    }
    validRoom.messages.push(message);
    return validRoom.save()
        .then((room) => {
            return {status:200, data:room};
        })
        .catch(err => {
            return {status:400, data:err};
        });
}

const addRoom = async(myId, selectedId)=>{
    var room = new ChatRoom({
        roomId : await ChatRoom.countDocuments({}) + 1,
        participants : [myId, selectedId],
        messages : []
    });
    return room.save()
        .then((res)=>{
            return res;
        })
        .catch(err => {
            throw err;
        })
}
const getRoom = async (req)=> {
    var validRoom = await ChatRoom.findOne({participants: { $all : [req.userId, req.selectedId]}});
    if(validRoom){
        return validRoom;
    }
    else {
        validRoom = await addRoom(req.userId, req.selectedId);
        return validRoom;
    }
}

module.exports = {
    ChatRoom,
    addChat,
    getRoom,
    addFile
}