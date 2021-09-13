const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require("./Models/Users").User;
const ChatRoom = require("./Models/ChatRoom").ChatRoom;

const httpServer = require("http").createServer(app);
const options = {cors: {
    origin: "*"
  }};
const io = require('socket.io')(httpServer,options)

app.use(express.json());
app.use(cors());

var url = "mongodb+srv://vara:vara@mycluster.zucif.gcp.mongodb.net/realTimeChat?retryWrites=true&w=majority"
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) { 
    console.log('Successfully connected to MongoDB.');
});

var usersDict = {}
//var myId = null;
io.on("connection", socket =>{
    console.log("socket is active",socket.id);

    socket.once("users",(myData)=>{
        var myId = myData.userId;
        usersDict[myId] = socket.id
        console.log(usersDict);
        User.find({},(err,validUsers)=>{
            io.to(usersDict[myId]).emit("users",validUsers)
        })
    })
    socket.on("getRoom",(selectedIdPayload)=>{
        selectedId = selectedIdPayload.selectedId;
        var myId = selectedIdPayload.userId;
        //console.log(selectedId,myId);
        ChatRoom.findOne({participants: { $all : [myId, selectedId]}},async (err,validRoom)=>{
            if(err) throw err;
            //console.log(validRoom);
            if(validRoom){
                io.to(usersDict[myId]).emit("getRoom",validRoom);
            }
            else{
                var curRoomId = await ChatRoom.countDocuments({}) + 1;
                var room = new ChatRoom({
                    roomId : curRoomId,
                    participants : [myId,selectedId],
                    messages : []
                });
                //console.log(room);
                room.save((err)=>{
                    if(err) throw err;
                    console.log('room created ', curRoomId);
                    io.to(usersDict[myId]).emit("getRoom",room)
                })
            }
        })
    })
    socket.on("chat",(payload) => {
        //console.log(payload) // payload = {message , selectedId, roomId}
        var myId = payload.userId;
        ChatRoom.findOne({roomId : payload.roomId},(err,validRoom)=>{
            //console.log(validRoom);
            var message = {
                messageId : validRoom.messages.length + 1,
                senderId : myId,
                time : new Date(),
                message : payload.message
            }
            validRoom.messages.push(message);
            validRoom.save((err)=>{
                if(err) throw err;
                //console.log('message added');
                // console.log(usersDict, payload.selectedId, usersDict[payload.selectedId], myId, usersDict[myId]);
                if(usersDict[payload.selectedId]){
                    io.to(usersDict[payload.selectedId]).emit("chat",message)
                }
                io.to(usersDict[myId]).emit("chat",message);
            })
        })
        // io.emit("chat", payload);
    })
});

app.get("/",(req,res)=>{
    res.send("Pipeline started");
})
app.post('/signup',async (req,res)=>{
    var newUser = new User(req.body);
    var resObj = {
        isSuccess : false,
        message : ""
    }
    newUser.userId = await User.countDocuments({}) + 1;
    User.findOne({email:req.body.email},(err,data)=>{
        if(err) throw err;
        if(data){
            resObj.isSuccess = false,
            resObj.message = "email already exists"
            res.send(resObj)
        }
        else{
            newUser.save((err)=>{
                if(err) throw err;
                console.log('saved successfully')
                resObj.isSuccess = true,
                resObj.message = 'user added successfully'
                res.send(resObj);
            })
        }
    })
})

app.post('/signin',(req,res)=>{
    var email = req.body.email;
    var password = req.body.pass;
    var resObj = {
        isSuccess: false,
        userId : null
    }
    User.findOne({email:email, password:password},(err,data)=>{
        //console.log(data);
        if(data){
            resObj.isSuccess = true;
            resObj.userId = data.userId;
            res.send(resObj);
        }
        else{
            res.send(resObj);
        }
    })
})
const port = 8080 ;
httpServer.listen(port,(err)=>{
    if(err) throw err;
    console.log('server started'); 
})