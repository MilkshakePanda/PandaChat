'use strict'

const WebSocketServer = require('websocket').server
const date = new Date()
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

// Listen for request
server.listen(port, function(err){
    if (err) throw err
    console.log("Server listening on port" + port)
})

// Store users and usernames
let users = []
let usernames = []

// Create new websocket server
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true // Set to false in production
})

// Extend the Array Prototype to get a random index from an array
Array.prototype.randIndex = function() {

    const randomIndex = Math.floor(Math.random() * this.length)
    return this[randomIndex]

}

// Establish connection
wsServer.on('connect', function(connection) {

    // When a user connects we store their connection
    // in the users array
    users.push(connection)
    console.log("Connection with socket is established")

    // When the clients send messages
    connection.on('message', function(message){

        // If they send plain text and not binaryData
        if (message.type === "utf8") {

           // We Parse the incoming JSON objects
           const messageData = JSON.parse(message.utf8Data)
            
           // If the username was sent and is not already in use
           if (messageData.action === "new user") {

               if (usernames.indexOf(messageData.body) != -1) {
                   // if this does not return -1, then the username is in the array
                   // therefore in use by another client
                   // send a json object with an event of username taken
                   // on the front end check for that event and deal with it accordingly
                   console.log('username taken')
                   connection.send(JSON.stringify({action: "username taken", message: "This username is taken bro, don't be greedy"}))

               } else {

                   // If the username is not taken then we can just add it to the array
                   connection.username = messageData.body // We attach the username to the socket itself
                   connection.color = colors.randIndex() // We assign it a random color from the list
                   usernames.push(connection.username)  // We add the username to the list

                   // Notify all users that the user joined the chat and send the new username array
               broadcast( JSON.stringify({action: "user joined", color: "#1D2B53", user: "PandaChat", body: connection.username + " has joined the discussion", usernames: usernames}) )

               }

           } else {

               // If the message sent wasn't a username then it's just a chat message, so broadcast it to all clients
               broadcast(JSON.stringify({action: "new message", color: connection.color, user: connection.username, body: messageData.body, time: getTimeStamp(), initials: returnUppercaseInitials(connection.username)}))

           }

        }
    })

    // When the connection is closed
    connection.on('close', function() {
        console.log(connection.username + " has disconnected")

        // Delete the connection
        users.splice(users.indexOf(connection), 1)

        // Delete the username
        usernames.splice(usernames.indexOf(connection.username), 1)

        if (connection.username) {

            // Notify chat room that the user has left
            broadcast( JSON.stringify( {action: "user joined", color: "#E04462", user: "PandaChat", body: connection.username + " has left the discussion", usernames: usernames}) )
        }

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

const getTimeStamp = () => {

    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`
}

const returnUppercaseInitials = (username) => {
   
   const initials = username.substring(0, 2) 
   return initials.toUpperCase()

}
