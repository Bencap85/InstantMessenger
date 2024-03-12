const express = require('express');
const dbUtils = require('./db/dbUtils');
const mongoose = require('mongoose');
const User = require('./db/models/User');
const Message = require('./db/models/Message');
const Conversation = require('./db/models/Conversation');
const { createJWT, verifyJWT } = require('./auth');
const cors = require('cors');
const ioLibrary = require('socket.io');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(8080, () => {
    console.log("Running on 8080");
});

const io = require('socket.io')(server, {
    cors:true,
    origins:["http://127.0.0.1:5347"],
   });



io.on('connection', (socket) => {
    console.log("New Connection");
    
    socket.on("joinConversation", (conversation) => {
        try {
            socket.join(conversation._id);
            console.log("Recieved request to join " + conversation._id);

            io.to(conversation._id).emit("successfullyJoined", "(To Room) Successfully joined room");

            io.emit("successfullyJoined", "(To all) Successfully joined room");
        } catch(err) {
            return socket.emit("error", "Error joining room");
        }
        
    });
    socket.on('leaveConversation', (conversation) => {
        try {
            socket.leave(conversation._id);
            console.log("Left room: " + conversation._id);
            io.to(conversation._id).emit("successfullyLeft", "A user left us");
        } catch(err) {
            console.log("Failed to leave conversation" + err);
            
        }
    });
    socket.on('newMessage', (message) => {
        console.log('message recived ' + message);
        let iterator = socket.adapter.rooms.keys()
        let array = Array.from(iterator);
        let room = array[array.length-1];
        // console.log("Array: " + array);
        // console.log("Room: " + room);
        // console.log('socketID: ' + socket.id);
        try {   
            io.to(room).emit("newMessage", message);
        } catch(err) {
            console.log(err);
        }
    });

});



let usersCollection = dbUtils.connect().db('InstantMessengerDB').collection('users');
let conversationsCollection = dbUtils.connect().db('InstantMessengerDB').collection('conversations');

app.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let user = null;

    try {
        user = await usersCollection.findOne({ email: email, password: password });
    } catch(err) {
        res.sendStatus(500);
    }

    if(!user) {
        res.sendStatus(404);
        return;
    }

    let token = createJWT(user.email+user.password);
    res.status(200).json({ token: token, user }).send();
    
});
app.post('/signUp', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let conversations = [];

    let user = new User({email: email, password: password, conversations: conversations});
    
    try {
        await usersCollection.insertOne(user);
        
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
    let token = createJWT(email+password);
    console.log("User: " + JSON.stringify(user));
    res.status(201).json({ token: token, user: user }).send();
    
});
app.get('/getUserInfo/:userId', async (req, res) => {
    const jwt = req.headers.authorization.split(' ')[1];
    
    if(verifyJWT(jwt) === false) {
        console.log("Invalid Token");
        res.sendStatus(403);
        return;
    } 


    let user = null;

    try {
        user = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId(req.params.userId) });
    } catch(err) {
        res.sendStatus(500);
    }

    if(!user) {
        res.sendStatus(404);
    } 
    
    res.status(200).json({ userData: user });

});
app.get('/getUserConversations/:userId', async (req, res) => {
    const jwt = req.headers.authorization.split(' ')[1];
    
    if(verifyJWT(jwt) === false) {
        console.log("Invalid Token");
        res.sendStatus(403);
        return;
    } 

    let conversations;
    console.log(req.params.userId);
    try {
        const query = { 'members': { $elemMatch: { ['_id']: req.params.userId } } };
        conversations = await conversationsCollection.find(query).toArray();
        console.log(JSON.stringify(conversations));
    } catch(err) {
        console.log("Error with queury: " + err);
        res.sendStatus(400);
        return;
    }

    res.status(200).json({ conversations: conversations });

});

app.post('/createConversation', async (req, res) => {
    const newConversation = req.body.conversation;
    const lastViewedByMember = {};
    for(let i = 0; i < newConversation.members.length; i++) {
        lastViewedByMember[newConversation.members[i]._id] = Date.now();
    }
    // console.log('Map: ' + JSON.stringify(map));
    
    newConversation.lastViewedByMember = lastViewedByMember;
    try {
        await conversationsCollection.insertOne(newConversation);
    } catch (err) {
        res.sendStatus(err);
    }
    
    res.status(201).send({ "message": "Successfully created new conversation" });
});
app.post('/updateLastViewedByMember/:conversationID', async (req, res) => {
    console.log("Updating...");
    try {
        const conversation = await conversationsCollection.findOne({ '_id' : new mongoose.Types.ObjectId(req.params.conversationID) } );
        const user = req.body.user;
        const newTime = new Date(req.body.newTime);
        const oldTimes = conversation.lastViewedByMember;
        oldTimes[user._id] = newTime;

        const updateDoc = {
            $set: {
                lastViewedByMember: oldTimes
            },
        };

        conversationsCollection.updateOne({ '_id' : new mongoose.Types.ObjectId(req.params.conversationID) }, updateDoc);
        console.log("Successfully updated time");
        res.sendStatus(200);
    } catch(err) {
        
        res.status(200).json({ message: 'Last viewed time not updated'}).send();
    }
});

app.post('/saveMessage/:conversationID', async (req, res) => {
    console.log("Sender: " + JSON.stringify(req.body.message));
    const message = new Message({ content: req.body.message.content, sender: new mongoose.Types.ObjectId(req.body.message.sender), time: req.body.message.time });
    try {
        const conversation = await conversationsCollection.findOne({ '_id' : new mongoose.Types.ObjectId(req.params.conversationID) } );
        
        const newMessages = conversation.messages;
        newMessages.push(message);

        const updateDoc = {
            $set: {
            messages: newMessages
            },
        };

        conversationsCollection.updateOne({ '_id' : new mongoose.Types.ObjectId(req.params.conversationID) }, updateDoc);
        res.sendStatus(200);
    } catch(err) {
        res.sendStatus(500);
    }

});
app.get('/searchForUsers/:email', async (req, res) => {

    const jwt = req.headers.authorization.split(' ')[1];
    if(verifyJWT(jwt) === false) {
        console.log("Invalid Token");
        res.sendStatus(403);
        return;
    } 

    let results = [];
    try {
        if(!req.params.email) {
            res.send([]);
        }
        cursor = usersCollection.find({ "email": { "$regex": `^${req.params.email}` } });
        for await (const result of cursor) {
            results.push(result);
        }
    } catch(err) {
        res.sendStatus(500);
    }
    res.send(results);
});

app.get('/deleteUsers', (req, res) => {
    try {   
        usersCollection.deleteMany({});
        res.send(200);
    } catch(err) {
        res.send(err);
    }
});
app.get('/deleteConversations', (req, res) => {
    try {
        conversationsCollection.deleteMany({});
        res.send(200);
    } catch(err) {
        res.send(err);
    }
});


 


