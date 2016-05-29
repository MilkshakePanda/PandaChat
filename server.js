const WebSocketServer = require("ws").Server
const http            = require("http")
const port            = process.env.PORT || 1337
const server          = http.createServer()

server.listen(port, function(error) {
   
    if (error) throw error

    console.log("Server listening on port " + port)

})

const wss = new WebSocketServer({
    server: server
})

console.log("WebSocketServer running")

// Define what is going to happen on connection (when the client requests a connection to this server)
wss.on('connection', function(ws) {
    
    console.log('Websocket connection opened')
    
    // Capture the messages sent by the client and log them to the console
    ws.on('message', function(message){
        console.log(message) 
    })
    
    // When the connection is closed
    ws.on('close', function(){
        console.log('WebSocket Connection closed')
    })
    
    // Send message to the client
    ws.send("Ping from server")

})
