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

