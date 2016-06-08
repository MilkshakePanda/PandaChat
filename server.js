const WebSocketServer = require('websocket').server
const express = require('express')
const path = require('path')
const port = process.env.PORT || 1337
const fs   = require('fs')
const app = express()
const http = require("http")
const server = http.createServer(app)

app.use("/public", express.static("public"))

// Render html file
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/client.html"))
})

server.listen(port, function(err){
    if (err) throw err
    console.log("Server listening on port" + port)
})

// Store users connections for broadcasting

const users = []

// Create new websocket server

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true // Set to false in production
})

wsServer.on('connect', function(connection) {
    
    // Establish connection
    // Store connection in the users array
    users.push(connection)
    console.log("Connection with socket is established") 

    // When the clients send messages
    connection.on('message', function(message){
        
        if (message.type === "utf8") {
           broadcast(message.utf8Data) 
        }
    })
   
    // When the connection is closed 
    connection.on('close', function() {
        console.log("Socket has disconnected") 
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


