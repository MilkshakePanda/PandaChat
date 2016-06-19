(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Establish connection with the socket server
var connection = new WebSocket("ws://localhost:1337", ['echo-protocol']);

var chatBox = document.querySelector(".chat__chat-box");
var usernameInput = document.querySelector(".login__username");
var messageInput = document.querySelector(".chat__message-input");

var loginPage = document.querySelector(".login");
var chatPage = document.querySelector(".chat");
var username = void 0;

// When the window loads
window.onload = function () {
    return usernameInput.focus();
};

// On open
connection.onopen = function () {
    return console.log("connected");
};

// On error
connection.onerror = function (error) {
    return console.log("There was an error of type " + error + " please try again shortly");
};

// On Message
connection.onmessage = function (event) {

    var incomingData = JSON.parse(event.data);
    var eventAction = incomingData.action;

    // Here we check the action event sent by the server
    // depending on the action, we perform different tasks
    // Ex: if chat message then display message but if new user then notifyChatRoom and updateConnectedUsers
    switch (eventAction) {

        case "new message":
            displayMessage(incomingData);
            break;
        case "user joined":
            notifyUsers(incomingData);
            updateConnectedUsers(incomingData.usernames);
            break;
        case "user left":
            notifyUsers(incomingData);
            updateConnectedUsers(incomingData.usernames);
            break;
    }
};

// Send Message
// **This function is fired whenever the user hits enter and a username is set**
// 1. We create a new JSON object with an event action of new message (which will be caught by the server to send back the content)
// 2. We send it to the server
// 3. We clear the input

// **Note that on the server we are not explicitly checking for a "new message" event. We are listening for a "new user" event. If the event isn't that one then it's obviously a "new message" event (I'm currently fasting at the time of writing, this might not make sense at all brah)

var sendMessage = function sendMessage() {
    var message = JSON.stringify({
        action: "new message",
        body: messageInput.value

    });
    connection.send(message);
    messageInput.value = "";
};

// Display Message
// This function is called when the event sent by the server is "new message"
// It takes the data sent by the server as a parameter
// 1. we create a template string containing two span tags wrapped around a <p> tag
// 2. we add the values from the data object to the elements
// 3. we set the innerHTML of the chat container to that string

var displayMessage = function displayMessage(data) {

    var messageToDisplay = "<p>\n        <span class=\"username\" style=\"color: " + data.color + ";\"> " + data.user + ": </span>\n        <span class=\"messageBody\"> " + data.body + " </span>\n\n    </p>";

    chatBox.innerHTML += messageToDisplay;
};

// Notify Users
// 1. We set the innerHTML of the notificationContainer to the message sent by the server ("user connected, "user left the chat")
// 2. We set the background color of the container to the one specified in the data object sent by the server
// 3. We show it (it's display none by default")
// 4. After two seconds we hide it again

// Create the element on the fly using template strings (className: chat__notifications)
var notifyUsers = function notifyUsers(data) {

    var notificationMessage = "<div class=\"chat__notifications\" style=\"display: block;\">\n        <p style=\"background-color: " + data.color + "\">" + data.body + "</p>\n    </div>";

    setTimeout(function () {
        return notificationMessage.style.display = "none";
    }, 2000);
};

// Update Connected Users
// 1. We loop through the usernames array sent by the server when the event action is "user joined" or "user left"
// 2. We create an empty string
// 3. for each username in the array we append an li element
// 4. outside the loop we set the innerHTML of the list container to that newly created string
// 5. When a user leaves this function is fired (it's very fast so people won't noticed that we are not caching the array)

var updateConnectedUsers = function updateConnectedUsers(usernames) {
    var usernamesContainer = document.querySelector(".connectedUsers");
    var connectedUsers = "";
    usernames.forEach(function (username) {
        return connectedUsers += "<li> " + username + " </li>";
    });
    usernamesContainer.innerHTML = connectedUsers;
};

// Set Username
// 1. We set the value of username (previously undefined) to the value of the username input
// 2. If the username input is not empty (if the user has entered a username)
//    We send an event to the server with an action of "new user" and a body equal to the newly created username
//    We then hide the login page And show the chat page
//    Finally we focus on the chat input for usability

var setUsername = function setUsername() {
    // set the value of username to whatever the user has entered in the input field.trim()
    username = usernameInput.value.trim();

    if (username) {
        connection.send(JSON.stringify({ action: "new user", body: username }));
        loginPage.style.display = "none";
        chatPage.style.display = "flex";
        messageInput.focus();
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

        if (username) {
            sendMessage();
        } else {
            setUsername();
        }
    }
};

document.body.className = "no-svg";

},{}]},{},[1])


//# sourceMappingURL=app.js.map
