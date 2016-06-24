(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _socket = require("./lib/socket");

var messageInput = document.querySelector(".chat__message-input");
var usernameInput = document.querySelector(".login__username");

_socket.Socket.connection = new WebSocket('wss://socketchat123.herokuapp.com');

// When the window loads
window.onload = function () {
    return usernameInput.focus();
};

// On open
_socket.Socket.connection.onopen = function () {
    return console.log("connected");
};

// On error
_socket.Socket.connection.onerror = function (error) {
    return console.log("There was an error of type " + error + " please try again shortly");
};

// On Message
_socket.Socket.connection.onmessage = function (event) {

    var incomingData = JSON.parse(event.data);
    var eventAction = incomingData.action;

    // Here we check the action event sent by the server
    // depending on the action, we perform different tasks
    // Ex: if chat message then display message but if new user then notifyChatRoom and updateConnectedUsers
    switch (eventAction) {

        case "new message":
            _socket.Socket.displayMessage(incomingData);
            break;
        case "user joined":
            _socket.Socket.notifyUsers(incomingData);
            _socket.Socket.updateConnectedUsers(incomingData.usernames);
            break;
        case "user left":
            _socket.Socket.notifyUsers(incomingData);
            _socket.Socket.updateConnectedUsers(incomingData.usernames);
            break;
    }
};

// We listen for keydown events
// When the user hits enter
// If when they hit enter, the value of username is defined, then that means the user is trying to send a message (because they can see the chat page)
// So in that case we call the sendMessage function
// However is username is not defined then they are still looking at the login page which means they want to set their username
// in that case we call the setUsername() function

window.onkeydown = function (event) {

    if (event.which === 13) {
        event.preventDefault();

        if (_socket.Socket.username && messageInput.value) {
            _socket.Socket.sendMessage();
        } else {
            _socket.Socket.setUsername();
        }
    }
};

},{"./lib/socket":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Socket = undefined;

var _sounds = require("./sounds");

var Socket = {
    username: null,
    connection: null
};

var loginPage = document.querySelector(".login");
var chatPage = document.querySelector(".chat");
var usernameInput = document.querySelector(".login__username");
var messageInput = document.querySelector(".chat__message-input");
var usernamesContainer = document.querySelector(".chat__users-list");
var messageBox = document.querySelector(".chat__messages");

// Send Message
// **This function is fired whenever the user hits enter and a username is set**
// 1. We create a new JSON object with an event action of new message (which will be caught by the server to send back the content)
// 2. We send it to the server
// 3. We clear the input

// **Note that on the server we are not explicitly checking for a "new message" event. We are listening for a "new user" event. If the event isn't that one then it's obviously a "new message" event (I'm currently fasting at the time of writing, this might not make sense at all brah)

Socket.sendMessage = function () {
    var message = JSON.stringify({
        action: "new message",
        body: messageInput.value

    });
    Socket.connection.send(message);
    messageInput.value = "";
};

// Display Message
// This function is called when the event sent by the server is "new message"
// It takes the data sent by the server as a parameter
// 1. we create a template string containing two span tags wrapped around a <p> tag
// 2. we add the values from the data object to the elements
// 3. we set the innerHTML of the chat container to that string

Socket.displayMessage = function (data) {

    var messageToDisplay = "\n    \n    <div class=\"message\">\n        <span class=\"message__avatar\" style=\"background-color: " + data.color + "\">" + data.initials + "</span>\n        <p class=\"message__body\">\n            <strong class=\"message__username\">" + data.user + "</strong>\n            " + data.body + "\n        </p>\n        <time>" + data.time + "</time>\n    </div>\n    ";

    messageBox.innerHTML += messageToDisplay;
    _sounds.Sounds.playNotification();
};

// Notify Users
// 1. We set the innerHTML of the notificationContainer to the message sent by the server ("user connected, "user left the chat")
// 2. We set the background color of the container to the one specified in the data object sent by the server
// 3. We show it (it's display none by default")
// 4. After two seconds we hide it again

// Create the element on the fly using template strings (className: chat__notifications)
Socket.notifyUsers = function (data) {

    var notificationMessage = "<div class=\"chat__notifications\" style=\"display: block;\">\n        <p style=\"background-color: " + data.color + "\">" + data.body + "</p>\n    </div>";

    messageBox.innerHTML += notificationMessage;
};

// Update Connected Users
// 1. We loop through the usernames array sent by the server when the event action is "user joined" or "user left"
// 2. We create an empty string
// 3. for each username in the array we append an li element
// 4. outside the loop we set the innerHTML of the list container to that newly created string
// 5. When a user leaves this function is fired (it's very fast so people won't noticed that we are not caching the array)
// Not an ideal solution. Need to think of a better approach but I'm fasting so whatevs

Socket.updateConnectedUsers = function (usernames) {
    var connectedUsers = "";
    usernamesContainer.innerHTML = "";
    usernames.forEach(function (username) {
        return connectedUsers += "<li> " + username + " </li>";
    });
    usernamesContainer.innerHTML += connectedUsers;
};

// Set Username
// 1. We set the value of username (previously undefined) to the value of the username input
// 2. If the username input is not empty (if the user has entered a username)
//    We send an event to the server with an action of "new user" and a body equal to the newly created username
//    We then hide the login page And show the chat page
//    Finally we focus on the chat input for usability

Socket.setUsername = function () {
    // set the value of username to whatever the user has entered in the input field.trim()
    Socket.username = usernameInput.value.trim();

    if (Socket.username) {
        Socket.connection.send(JSON.stringify({ action: "new user", body: Socket.username }));
        loginPage.style.display = "none";
        chatPage.style.display = "flex";
        document.body.className = "no-svg";
        messageInput.focus();
    }
};

exports.Socket = Socket;

},{"./sounds":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var muteBtn = document.getElementById("mute");

var Sounds = {

    track: new Audio(),
    audioAllowed: true

};

Sounds.track.src = '/public/audio/message.wav';

Sounds.playNotification = function () {
    if (Sounds.audioAllowed) {
        Sounds.track.play();
    }
};

Sounds.toggleNotificationSounds = function (event) {

    var button = event.target;

    if (Sounds.audioAllowed) {
        Sounds.audioAllowed = false;
        button.innerHTML = "Unmute Sound";
    } else {
        Sounds.audioAllowed = true;
        button.innerHTML = "Mute Sound";
    }
};

muteBtn.addEventListener("click", function (event) {
    return Sounds.toggleNotificationSounds(event);
}, false);

exports.Sounds = Sounds;

},{}]},{},[1])


//# sourceMappingURL=app.js.map
