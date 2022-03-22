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
var selectedUser = {}
//var myId = null;
const GetUsersService = require('./Services/getUsersService').GetUsersService;
const {addChat, getRoom} = require('./Models/ChatRoom');

io.on("connection", socket =>{
    console.log("socket is active",socket.id);

    socket.once("users",async(myData)=>{
        var myId = myData.userId;
        socket.data.id = myId;
        usersDict[myId] = socket.id;
        //console.log(usersDict);
        const validUsers = await GetUsersService();
        io.to(usersDict[myId]).emit("users",validUsers);
        
    })
    socket.on("getRoom",async(selectedIdPayload)=>{
        var selectedId = selectedIdPayload.selectedId;
        var myId = selectedIdPayload.userId;
        //console.log(selectedId,myId);
        var validRoom = await getRoom(selectedIdPayload);
        selectedUser[myId] = selectedId;
        //console.log(selectedUser);
        io.to(usersDict[myId]).emit("getRoom",validRoom);
    })
    socket.on("chat",async (payload) => {
        //console.log(payload) // payload = {message , selectedId, roomId}
        var myId = payload.userId;
        var res = await addChat(payload);
        if(res.status == 400){
            throw message.data;
        }
        else{
            res.data.sender = payload.userId;
            if(usersDict[payload.selectedId] && selectedUser[payload.selectedId] && selectedUser[payload.selectedId] === myId){
                io.to(usersDict[payload.selectedId]).emit("chat",res.data)
            }
            io.to(usersDict[myId]).emit("chat",res.data);
        }
    })

    socket.on("fileTransfer", async (payload) => {
        const response = await fileSaveService(payload);
        console.log(response);
    })

    socket.on("callUser", (data) => {
        if(usersDict[data.userToCall]){
            io.to(usersDict[data.userToCall]).emit("recieveCall", { signal: data.signalData, from: data.from});
        }
    })

    socket.on("endCall",(data)=>{
        io.to(usersDict[data.callerId]).emit("callEnded",{});
        io.to(usersDict[data.receiverId]).emit("callEnded",{});
    })

    socket.on("acceptCall", (data) => {
        io.to(usersDict[data.to]).emit("callAccepted", data.signal);
    })

    socket.on("disconnect",()=>{
        console.log("disconnected",socket.id);
        Object.entries(usersDict).forEach(([key, value]) => {
            if(value == socket.id){
                delete usersDict[key];
                delete selectedUser[key];
            }
        })
        
    })
}); 

app.get("/",(req,res)=>{
    res.send("Pipeline started");
})

//signup
const signUpService = require('./Services/signupService').signUpService;
app.post("/signup", async (req,res)=>{
    const data = await signUpService(req.body);
    res.send(data);
})

//signin
const SignInService = require('./Services/signInService').SignInService;
//const { use } = require('express/lib/router');
const { fileSaveService } = require('./Services/fileSaveService');
app.post("/signin", async(req,res)=>{
    //console.log(req.body);
    const response = await SignInService(req.body);
    //console.log(response);
    res.send(response);
})

const port = process.env.PORT || 8080 ;
httpServer.listen(port,(err)=>{
    if(err) throw err;
    console.log('server started'); 
})