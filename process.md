# Basic process to follow 

1. create server.js and client.html (rename them after)
2. inside client.html , create a dummy html template and add a script tag (in fact, you can even write the scripts in a separate file.
3. inside that script, create a new WebSockets object (call it connection) and pass it the url to connect to ("ws://localhost:PORT")
4. Create the connection.onopen function and log something to the console 
5. npm init 
6. npm install --save ws 
7. require ws (const WebSocketServer = require("ws").Server)
8. require http 
9. create the port variable process.env.PORT || 1337 
10. create the httpServer 
11. create the wss server and set the server key equal to the newly create http server like so 

const wss = new WebSocketServer({
    
    server: server

})
12. call the listen method on the server object and log to the console a message saying that the websocket server is created and listening on the port provided
13. handle the connection event on the wss object (that takes a callback with a socket argument) 
14. inside of that callback, we can handle events like message and close for each socket connection

## Concept x Features 

The client emits or sends a message to the server
The server catches that message and sends it back to the clients 
We also want to display the number of people who are logged in or participating in the chat 
(save the number of connections in a variable)
Ideally we would want to display their username 
When a user leaves the chat, we want to display a message saying "user has left the chat"
When a user comes back, we want to display a message saying "user has joined the chat"
(we are not going to make the data persistent in this example, but we might when we use a more advanced and robust framework like socket.io)

# Notes about websocket module

- If we decide to not allow anyone to connect (ie setting the autoAcceptConnections to false), then on the client we want to specify a specific protocal and perhaps check if the origin is allowed or not. When we set that option to false, the server will then emit a request event which we can attach a callback to. In that callback function we want to make all the necessary checks regarding the origin of the request and decide whether or not to reject it. Also on the client side, we would have to add 'echo-protocol' property upon instantiation of the WebSocket object

- If however we allow all hosts to connect to the server, then in that case it will emit a connect event. We can then catch the connection and the process is pretty much the same as the video. catch the incoming messages and send them to the client. To simulate the broadcast feature available in frameworks like socket.io we can store the users connection in an array. then in that array send a message to that particular user. (all users connected will receive the message)


# Video - 

- Write the code in es6 format
- Use modules (overkill)
- Show the first method and then the broadcasting method (without saving the users connections we are only communicating to a single client)
- Show how to implement users functionality ?

