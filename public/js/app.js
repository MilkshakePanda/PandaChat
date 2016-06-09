// Establish connection with the socket server
const connection = new WebSocket("ws://localhost:1337", ['echo-protocol'])
const chatContainer = document.querySelector(".messages")
const usernameInput = document.querySelector(".username-input")
const messageInput  = document.querySelector(".message-input")
const loginPage     = document.querySelector(".login")
const chatPage     = document.querySelector(".chat")
let username

// On open
connection.onopen = () => console.log("connected") 
    
// On error
connection.onerror = (error) => console.log("There was an error of type " + error + " please try again shortly") 

// On Message
connection.onmessage = (event) => {
    
    const incomingData = JSON.parse(event.data)
    const eventAction  = incomingData.action
    
    // Switch case
    switch(eventAction) {

        case "new message":
            displayMessage(incomingData) 
            break;
        case "user joined":
            notifyUsers(incomingData) 
            showConnectedUsers(incomingData.usernames)
            break;
        case "user left":
            notifyUsers(incomingData)
            showConnectedUsers(incomingData.usernames)
            break;
    }

}

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

    const messageElement = document.createElement("P") 
    const usernameSpan   = document.createElement("span") 
    const messageBodySpan = document.createElement("span")
    
    usernameSpan.classList.add("username")
    usernameSpan.style.color = message.color
    usernameSpan.innerHTML = message.user  + ": "
    
    messageBodySpan.classList.add("messageBody")
    messageBodySpan.innerHTML = message.body
    
    messageElement.appendChild(usernameSpan)
    messageElement.appendChild(messageBodySpan)
    
    chatContainer.appendChild(messageElement)
}


// Notify Users
// 1. Create the element
// 2. Set its background color
// 3. Set its text content to the message sent by the server
// 4. Append the element to the notification container
// 6. We show the notification container then hide it after two seconds
// 5. Optional : Play a sound

const notifyUsers = (data) => {
    
    const notificationContainer = document.querySelector(".userNotification")
    const notificationElement = document.createElement("P")

    notificationElement.style.backgroundColor = data.color
    notificationElement.innerHTML = data.body
    notificationContainer.appendChild(notificationElement)
    notificationContainer.style.display = "block"

    setTimeout( () => notificationContainer.style.display = "none", 2000)
}

const showConnectedUsers = (usernames) => {
    
    const usernamesContainer = document.querySelector(".connectedUsers")
    let   connectedUsers     = ""  

    // loop through the usernames array
    usernames.forEach( (username) => {
        
        // for each one create an li element
        // and set its text content to the username
        connectedUsers += "<li>" + username +"</li>"
    })

    usernamesContainer.innerHTML = connectedUsers
}

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

