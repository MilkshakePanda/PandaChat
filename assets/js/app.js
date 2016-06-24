import {Socket} from './lib/socket'

const messageInput  = document.querySelector(".chat__message-input")
const usernameInput = document.querySelector(".login__username")


Socket.connection = new WebSocket('wss://socketchat123.herokuapp.com')

// When the window loads
window.onload = () => usernameInput.focus() 


// On open
Socket.connection.onopen = () => console.log("connected") 

// On error
Socket.connection.onerror = (error) => console.log("There was an error of type " + error + " please try again shortly")

// On Message
Socket.connection.onmessage = (event) => {

    const incomingData = JSON.parse(event.data)
    const eventAction  = incomingData.action

    // Here we check the action event sent by the server
    // depending on the action, we perform different tasks
    // Ex: if chat message then display message but if new user then notifyChatRoom and updateConnectedUsers
    switch(eventAction) {

        case "new message":
            Socket.displayMessage(incomingData)
            break;
        case "user joined":
            Socket.notifyUsers(incomingData)
            Socket.updateConnectedUsers(incomingData.usernames)
            break;
        case "user left":
            Socket.notifyUsers(incomingData)
            Socket.updateConnectedUsers(incomingData.usernames)
            break;
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

        if (Socket.username && messageInput.value) {
            Socket.sendMessage()
        }
        else {
            Socket.setUsername()
        }

    }
}

