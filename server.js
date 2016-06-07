const WebSocketServer = require('websocket').server
const connect = require('connect')
const http    = require('http')
const port = process.env.PORT || 1337
const fs   = require('fs')
const app = connect()

// create server
const server = http.createServer(app)

// Serve index.html
app.use('/', function(request, response) {
    
    if (request.method == "GET") {
        
        response.writeHead(200, {"Content-Type": "text/html"})
        fs.createReadStream(__dirname + "/client.html").pipe(response)

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


