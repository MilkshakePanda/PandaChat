import {Sounds} from './sounds'

let Socket = {
    username: null,
    connection: new WebSocket('ws://localhost:1337', ['echo-protocol'])
}

const loginPage     = document.querySelector(".login")
const chatPage     = document.querySelector(".chat")
const usernameInput = document.querySelector(".login__username")
const messageInput  = document.querySelector(".chat__message-input")
const usernamesContainer = document.querySelector(".chat__users-list")
const messageBox    = document.querySelector(".chat__messages")

// Send Message
// **This function is fired whenever the user hits enter and a username is set**
// 1. We create a new JSON object with an event action of new message (which will be caught by the server to send back the content)
// 2. We send it to the server
// 3. We clear the input

// **Note that on the server we are not explicitly checking for a "new message" event. We are listening for a "new user" event. If the event isn't that one then it's obviously a "new message" event (I'm currently fasting at the time of writing, this might not make sense at all brah)

Socket.sendMessage = () => {
    const message = JSON.stringify({
        action: "new message",
        body: messageInput.value

    })
    Socket.connection.send(message)
    messageInput.value = ""
}

// Display Message
// This function is called when the event sent by the server is "new message"
// It takes the data sent by the server as a parameter
// 1. we create a template string containing two span tags wrapped around a <p> tag
// 2. we add the values from the data object to the elements
// 3. we set the innerHTML of the chat container to that string

Socket.displayMessage = (data) => {

    let messageToDisplay  = `
    
    <div class="message">
        <span class="message__avatar" style="background-color: ${data.color}">${data.initials}</span>
        <p class="message__body">
            <strong class="message__username">${data.user}</strong>
            ${data.body}
        </p>
        <time>${data.time}</time>
    </div>
    `

    messageBox.innerHTML += messageToDisplay
    Sounds.playNotification()
}


// Notify Users
// 1. We set the innerHTML of the notificationContainer to the message sent by the server ("user connected, "user left the chat")
// 2. We set the background color of the container to the one specified in the data object sent by the server
// 3. We show it (it's display none by default")
// 4. After two seconds we hide it again

// Create the element on the fly using template strings (className: chat__notifications)
Socket.notifyUsers = (data) => {

    const notificationMessage = `<div class="chat__notifications" style="display: block;">
        <p style="background-color: ${data.color}">${data.body}</p>
    </div>`
    
    messageBox.innerHTML += notificationMessage
}

// Update Connected Users
// 1. We loop through the usernames array sent by the server when the event action is "user joined" or "user left"
// 2. We create an empty string
// 3. for each username in the array we append an li element
// 4. outside the loop we set the innerHTML of the list container to that newly created string
// 5. When a user leaves this function is fired (it's very fast so people won't noticed that we are not caching the array)
// Not an ideal solution. Need to think of a better approach but I'm fasting so whatevs


Socket.updateConnectedUsers = (usernames) => {
    let  connectedUsers  = ""
    usernamesContainer.innerHTML = ""
    usernames.forEach( (username) => connectedUsers += `<li> ${username} </li>`)
    usernamesContainer.innerHTML += connectedUsers
}


// Set Username
// 1. We set the value of username (previously undefined) to the value of the username input
// 2. If the username input is not empty (if the user has entered a username)
//    We send an event to the server with an action of "new user" and a body equal to the newly created username
//    We then hide the login page And show the chat page
//    Finally we focus on the chat input for usability

Socket.setUsername = () => {
    // set the value of username to whatever the user has entered in the input field.trim()
    Socket.username = usernameInput.value.trim()

    if (Socket.username) {
        Socket.connection.send(JSON.stringify({action: "new user", body: Socket.username}))
        loginPage.style.display = "none"
        chatPage.style.display = "flex"
        document.body.className = "no-svg"
        messageInput.focus()
    }

}

export {Socket}
