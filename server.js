const WebSocketServer = require('websocket').server
const express = require('express')
const app = express()
const port = process.env.PORT || 1337
const fs   = require('fs')
const server = require('http').createServer(app)
const colors       = ["#BD1E1E", "#EFCB68", "#558D8F", "#D79C57", "#B9314F", "#4392F1", "#18206F"]

app.use("/public", express.static("public"))

// Render html file
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/client.html")
})

server.listen(port, function(err){
    if (err) throw err
    console.log("Server listening on port" + port)
})

// Store users connections for broadcasting

let users = []
let usernames = []

// Create new websocket server

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true // Set to false in production
})

// Extend the Array Prototype 
Array.prototype.randIndex = function() {

    var ri = Math.floor(Math.random() * this.length)
    return this[ri] 

}


wsServer.on('connect', function(connection) {
    
    // Establish connection
    // Store connection in the users array
    users.push(connection)
    console.log("Connection with socket is established") 

    // When the clients send messages
    connection.on('message', function(message){

        if (message.type === "utf8") {
           
           const messageData = JSON.parse(message.utf8Data)
           console.log(messageData)

           // If the username was sent and is not already in use
           if (messageData.action === "new user") {
                
               if (usernames.indexOf(messageData.body) != -1) {
                   
                   // if this does not return -1, then the username is in the array
                   // therefore in use by another client
                   // send a json object with an event of username taken
                   // on the front end check for that event and deal with it accordingly
                   connection.send(JSON.stringify({action: "username taken", message: "This username is taken bro, don't be greedy"}))
                   
               } else {
                   
                   // If the username is not taken then we can just add it to the array
                   connection.username = messageData.body
                   connection.color = colors.randIndex()
                   usernames.push(connection.username)
                    
                   // Notify all users that the user joined the chat
                   broadcast( JSON.stringify( {action: "user joined", user: "PandaChat", body: connection.username + " has just joined the discussion"}) )

               }

           } else {
            
               // If the message sent wasn't a username then it's just a chat message, so broadcast it to all clients
               broadcast(JSON.stringify({action: "new message", color: connection.color, user: connection.username, body: messageData.body})) 
           
           }

        }
    })
   
    // When the connection is closed 
    connection.on('close', function() {
        console.log("Socket has disconnected") 
        delete users[connection]
    })
    
})

const broadcast = (data) => {
    
    // Loop through the connected users
    users.forEach( (user) => {
        
        if (user.connected) {
            
            user.send(data)
        }
    
    })

}


