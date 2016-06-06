The API for WebSocket-Node is designed to feel similar to the Node HTTP APIs.  As such, application developers are expected to keep references to open connections in whatever way makes sense for their application.  In my usage for my virtual world platform, this involves keeping references to the open connection in each `User` object, and keeping a list of `User` objects in each active `Room` object.

Some people have asked for a more global approach, which doesn't fit my style and will likely not perform as well, but here's an example.  This code will assign an incrementing connection ID to each connection, and keep a reference to it in an object (hash) for easy lookup by ID later.

```javascript
#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({ httpServer: server });

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connections = {};
var connectionIDCounter = 0;

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept(null, request.origin);
    
    // Store a reference to the connection using an incrementing ID
    connection.id = connectionIDCounter ++;
    connections[connection.id] = connection;
    
    // Now you can access the connection with connections[id] and find out
    // the id for a connection with connection.id
    
    console.log((new Date()) + ' Connection ID ' + connection.id + ' accepted.');
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. ' +
                    "Connection ID: " + connection.id);
        
        // Make sure to remove closed connections from the global pool
        delete connections[connection.id];
    });
});

// Broadcast to all open connections
function broadcast(data) {
    Object.keys(connections).forEach(function(key) {
        var connection = connections[key];
        if (connection.connected) {
            connection.send(data);
        }
    });
}

// Send a message to a connection by its connectionID
function sendToConnectionId(connectionID, data) {
    var connection = connections[connectionID];
    if (connection && connection.connected) {
        connection.send(data);
    }
}
```