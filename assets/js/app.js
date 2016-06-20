// Establish connection with the socket server
const connection = new WebSocket("ws://localhost:1337", ['echo-protocol'])

const chatBox       = document.querySelector(".chat__chat-box")
const messageBox    = document.querySelector(".chat__messages")
const usernameInput = document.querySelector(".login__username")
const messageInput  = document.querySelector(".chat__message-input")
const usernamesContainer = document.querySelector(".chat__users-list")

const loginPage     = document.querySelector(".login")
const chatPage     = document.querySelector(".chat")
let username

// When the window loads
window.onload = () => usernameInput.focus()

// On open
connection.onopen = () => console.log("connected") 

// On error
connection.onerror = (error) => console.log("There was an error of type " + error + " please try again shortly")

// On Message
connection.onmessage = (event) => {

    const incomingData = JSON.parse(event.data)
    const eventAction  = incomingData.action

    // Here we check the action event sent by the server
    // depending on the action, we perform different tasks
    // Ex: if chat message then display message but if new user then notifyChatRoom and updateConnectedUsers
    switch(eventAction) {

        case "new message":
            displayMessage(incomingData)
            break;
        case "user joined":
            notifyUsers(incomingData)
            console.log(incomingData.usernames)
            updateConnectedUsers(incomingData.usernames)
            break;
        case "user left":
            notifyUsers(incomingData)
            updateConnectedUsers(incomingData.usernames)
            break;
    }

}

// Send Message
// **This function is fired whenever the user hits enter and a username is set**
// 1. We create a new JSON object with an event action of new message (which will be caught by the server to send back the content)
// 2. We send it to the server
// 3. We clear the input

// **Note that on the server we are not explicitly checking for a "new message" event. We are listening for a "new user" event. If the event isn't that one then it's obviously a "new message" event (I'm currently fasting at the time of writing, this might not make sense at all brah)

const sendMessage = () => {
    const message = JSON.stringify({
        action: "new message",
        body: messageInput.value

    })
    connection.send(message)
    messageInput.value = ""
}

// Display Message
// This function is called when the event sent by the server is "new message"
// It takes the data sent by the server as a parameter
// 1. we create a template string containing two span tags wrapped around a <p> tag
// 2. we add the values from the data object to the elements
// 3. we set the innerHTML of the chat container to that string


const displayMessage = (data) => {

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
}


// Notify Users
// 1. We set the innerHTML of the notificationContainer to the message sent by the server ("user connected, "user left the chat")
// 2. We set the background color of the container to the one specified in the data object sent by the server
// 3. We show it (it's display none by default")
// 4. After two seconds we hide it again

// Create the element on the fly using template strings (className: chat__notifications)
const notifyUsers = (data) => {

    const notificationMessage = `<div class="chat__notifications" style="display: block;">
        <p style="background-color: ${data.color}">${data.body}</p>
    </div>`

    setTimeout( () => notificationMessage.style.display = "none", 2000)
}

// Update Connected Users
// 1. We loop through the usernames array sent by the server when the event action is "user joined" or "user left"
// 2. We create an empty string
// 3. for each username in the array we append an li element
// 4. outside the loop we set the innerHTML of the list container to that newly created string
// 5. When a user leaves this function is fired (it's very fast so people won't noticed that we are not caching the array)

const updateConnectedUsers = (usernames) => {
    let   connectedUsers     = ""
    usernames.forEach( (username) => connectedUsers += `<li> ${username} </li>`)
    usernamesContainer.innerHTML += connectedUsers
}


// Set Username
// 1. We set the value of username (previously undefined) to the value of the username input
// 2. If the username input is not empty (if the user has entered a username)
//    We send an event to the server with an action of "new user" and a body equal to the newly created username
//    We then hide the login page And show the chat page
//    Finally we focus on the chat input for usability

const setUsername = () => {
    // set the value of username to whatever the user has entered in the input field.trim()
    username = usernameInput.value.trim()

    if (username) {
        connection.send(JSON.stringify({action: "new user", body: username}))
        loginPage.style.display = "none"
        chatPage.style.display = "flex"
        messageInput.focus()

    }

}

// We listen for keydown events
// When the user hits enter
// If when they hit enter, the value of username is defined, then that means the user is trying to send a message (because they can see the chat page)
    // So in that case we call the sendMessage function
// However is username is not defined then they are still looking at the login page which means they want to set their username
    // in that case we call the setUsername() function


window.onkeydown = (event) => {

    if (event.which === 13) {
        event.preventDefault()

        if (username) {
            sendMessage()
        }
        else {
            setUsername()
        }

    }
}

document.body.className = "no-svg"
