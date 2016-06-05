const WebSocketServer = require('websocket').server
const http = require('http')
const port = process.env.PORT || 1337
const fs   = require('fs')


// create server
const server = http.createServer(function(request, response){

    response.writeHead(200, {"Content-Type": "text/html"})
    
    if (request.url == "/") {
    
        fs.readFile(__dirname + "/client.html", null, function(error, data){
            if (error) {
                response.writeHead(404)
                response.end("File not found bro")
            } else {
                response.end(data) 
            }
        
        })
    }
})

server.listen(port, function(err){
    if (err) throw err
    console.log("Server listening on port" + port)
})

// Create new websocket server

// Store users connections for broadcasting

const users = []

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true // Set to false in production
})

wsServer.on('connect', function(connection) {
    
    // Establish connection
    // Store connection in the users array
    users.push(connection)

    const userId = Math.round(Math.random() * 100) 
    console.log("connection from "  + userId)  

    // When the clients send messages
    connection.on('message', function(message){
                
        if (message.type === "utf8") {

            // Loop through users and send them the message    
            users.forEach( (user) => {
                
                user.send(message.utf8Data)
                // connection.send(message.utf8Data) 
            })
        }
    })
   
    // When the connection is closed 
    connection.on('close', function() {
        console.log("Socket has disconnected") 
    })
    
})



