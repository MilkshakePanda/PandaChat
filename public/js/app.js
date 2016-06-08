// Establish connection with the socket server
const connection = new WebSocket("ws://localhost:1337", ['echo-protocol'])
const chatContainer = document.querySelector(".messages")
const usernameInput = document.querySelector(".username-input")
const messageInput  = document.querySelector(".message-input")
const loginPage     = document.querySelector(".login")
const chatPage     = document.querySelector(".chat")
let username

Array.prototype.randIndex = function() {

    var ri = Math.floor(Math.random() * this.length)
    return this[ri] 

}

// On open
connection.onopen = () => console.log("connected") 
    
// On error
connection.onerror = (error) => console.log("There was an error of type " + error + " please try again shortly") 

// On Message
connection.onmessage = (event) => displayMessage(event.data)

// When the user submits the form

const sendMessage = () => {
    const message = {
        action: "new message",         
        body: messageInput.value
    
    }
    connection.send(JSON.stringify(message))
    messageInput.value = ""
}

const displayMessage = (message) => {


    // Switch case

    // if message.action == new message
    // display the chat message

    // if message.action == user joined
    // display message at the top
    
    // if message.action == user left
    // display message at the top

    const incomingMessage = JSON.parse(message)
    const messageElement = document.createElement("P") 
    const usernameSpan   = document.createElement("span") 
    const messageBodySpan = document.createElement("span")
    
    usernameSpan.classList.add("username")
    usernameSpan.style.color = incomingMessage.color
    usernameSpan.innerHTML = incomingMessage.user  + ": "
    
    messageBodySpan.classList.add("messageBody")
    messageBodySpan.innerHTML = incomingMessage.body
    
    messageElement.appendChild(usernameSpan)
    messageElement.appendChild(messageBodySpan)
    
    chatContainer.appendChild(messageElement)
}

const setUsername = () => {
    
    // set the value of username to whatever the user has entered in the input field.trim()
    username = usernameInput.value.trim()
    
    connection.send(JSON.stringify({action: "new user", body: username}))
        
    loginPage.style.display = "none"
    chatPage.style.display = "flex"
    messageInput.focus()
}


window.onkeydown = (event) => {
    
    // When the user hits enter
    // If there is a username already sent, that means they already registered, so they want to send a message
    // If however a username wasn't set, then they are still in the login page trying to enter the chat room
    // so we set a username then

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

